import os
import sys
import collections
import random
import json
import torch
import torch.nn as nn
import torch.optim as optim
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
from tqdm import tqdm

# Add backend to path
sys.path.append(os.path.join(os.path.dirname(__file__), "..", "..", "backend"))
from app.ml_service.model import MultiTaskCropModel

CROP_ALIASES = {
    'bananalsd': 'banana',
    'pea plant dataset': 'pea',
    'onion datasets': 'onion',
    'cacao_diseases': 'cacao',
    'palm-disease-dataset': 'palm',
    'soyabeans': 'soybean',
    'tea sickness dataset': 'tea'
}

STANDARD_DISEASE_NAMES = {
    'gray_light': 'gray_blight',
    'sudden_death_syndrone': 'sudden_death_syndrome',
    'leaf_crinckle': 'leaf_crinkle',
    'fussarium_wilt': 'fusarium_wilt',
    'leafminner_leaf': 'leaf_miner',
    'downy_mildew_leaf': 'downy_mildew',
    'powder_mildew_leaf': 'powdery_mildew',
    'onion1': 'unspecified_rot'
}

def clean_crop_name(raw_name):
    norm = raw_name.lower().strip()
    if norm in CROP_ALIASES:
        return CROP_ALIASES[norm]
    cleaned = norm.replace("dataset", "").replace("diseases", "").replace("sickness", "").strip().replace(" ", "_").replace("-", "_")
    return cleaned if cleaned else norm

def clean_disease_name(crop_name, rel_folder):
    parts = [p.strip() for p in rel_folder.replace('\\', '/').split('/') if p.strip()]
    useful_parts = [p for p in parts if p.lower() not in ('originalset', 'original_set', 'images', 'data')]
    
    leaf = useful_parts[-1] if useful_parts else (parts[-1] if parts else "healthy")
    leaf_norm = leaf.lower().replace('-', '_').replace(' ', '_')
    
    prefix_to_strip = f"{crop_name}___"
    if leaf_norm.startswith(prefix_to_strip):
        leaf_norm = leaf_norm[len(prefix_to_strip):]
    prefix_to_strip2 = f"{crop_name}_"
    if leaf_norm.startswith(prefix_to_strip2) and len(leaf_norm) > len(prefix_to_strip2) and not leaf_norm.startswith(f"{crop_name}_healthy"):
        sub = leaf_norm[len(prefix_to_strip2):]
        if sub:
            leaf_norm = sub

    if 'healthy' in leaf_norm or 'fresh' in leaf_norm:
        cond = "healthy"
    else:
        cond = leaf_norm
        if cond.endswith('_d'): cond = cond[:-2]
        if cond.endswith('_p'): cond = cond[:-2]
        if cond.endswith('_augment'): cond = cond[:-8]
        if cond in STANDARD_DISEASE_NAMES:
            cond = STANDARD_DISEASE_NAMES[cond]
        
    disease_key = f"{crop_name}_{cond}"
    title_words = cond.replace('_', ' ').title()
    if 'Healthy' in title_words:
        display_name = f"Healthy {crop_name.capitalize()} Leaf"
    else:
        display_name = f"{title_words} ({crop_name.capitalize()})"
        
    return disease_key, display_name

def discover_images(root_dir):
    """Dynamically discover all crop and disease samples from directory structure."""
    samples = []
    crop_set = set()
    disease_set = set()
    crop_to_diseases = collections.defaultdict(set)
    disease_display_names = {}

    for top_item in sorted(os.listdir(root_dir)):
        top_path = os.path.join(root_dir, top_item)
        if not os.path.isdir(top_path):
            continue

        crop_name = clean_crop_name(top_item)
        crop_set.add(crop_name)

        def walk(current_path, rel_p=''):
            items = sorted(os.listdir(current_path))
            imgs = [f for f in items if f.lower().endswith(('.jpg', '.jpeg', '.png')) and os.path.isfile(os.path.join(current_path, f))]
            subdirs = [f for f in items if os.path.isdir(os.path.join(current_path, f))]

            if imgs:
                d_key, display_name = clean_disease_name(crop_name, rel_p)
                disease_set.add(d_key)
                crop_to_diseases[crop_name].add(d_key)
                disease_display_names[d_key] = display_name
                for img_f in imgs:
                    samples.append((os.path.join(current_path, img_f), crop_name, d_key))

            for sd in subdirs:
                next_rel = f"{rel_p}/{sd}" if rel_p else sd
                walk(os.path.join(current_path, sd), next_rel)

        walk(top_path)

    crop_classes = sorted(list(crop_set))
    disease_classes = sorted(list(disease_set))
    crop_to_diseases_dict = {c: sorted(list(crop_to_diseases[c])) for c in crop_classes}

    # Map samples to indices
    indexed_samples = []
    for path, c_name, d_name in samples:
        c_idx = crop_classes.index(c_name)
        d_idx = disease_classes.index(d_name)
        indexed_samples.append((path, c_idx, d_idx))

    metadata = {
        "crop_classes": crop_classes,
        "disease_classes": disease_classes,
        "crop_to_diseases": crop_to_diseases_dict,
        "crop_disease_display_names": disease_display_names
    }

    print(f"\n{'='*60}")
    print(f"  DYNAMIC DATASET DISCOVERY COMPLETE")
    print(f"  Total Crops    : {len(crop_classes)}")
    print(f"  Total Diseases : {len(disease_classes)}")
    print(f"  Total Samples  : {len(indexed_samples)}")
    print(f"{'='*60}\n")

    return indexed_samples, metadata


class MultiTaskCropDataset(Dataset):
    def __init__(self, samples, transform=None):
        self.samples = samples
        self.transform = transform

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        img_path, crop_label, disease_label = self.samples[idx]
        try:
            image = Image.open(img_path).convert("RGB")
        except Exception:
            image = Image.new("RGB", (224, 224), color=0)
        if self.transform:
            image = self.transform(image)
        return image, crop_label, disease_label


def compute_class_weights(samples, num_classes, label_index):
    """Compute inverse-frequency weights for class balance."""
    counts = collections.Counter(s[label_index] for s in samples)
    total = len(samples)
    weights = torch.zeros(num_classes)
    for cls_idx, cnt in counts.items():
        weights[cls_idx] = total / (num_classes * cnt)
    weights[weights == 0] = 1.0
    return weights


def train_model(epochs=12, batch_size=32, lr=0.001):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"\nTraining device: {device}")

    dataset_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "data", "Crop___Disease")
    model_save_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
    os.makedirs(model_save_dir, exist_ok=True)
    model_save_path = os.path.join(model_save_dir, "best_model.pth")
    metadata_save_path = os.path.join(model_save_dir, "class_mappings.json")

    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomVerticalFlip(p=0.2),
        transforms.RandomRotation(20),
        transforms.ColorJitter(brightness=0.3, contrast=0.3, saturation=0.2, hue=0.1),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])
    val_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225])
    ])

    all_samples, metadata = discover_images(dataset_dir)
    if not all_samples:
        print("ERROR: No images found.")
        return

    # Save metadata JSON for backend inference & recommendations synchronization
    with open(metadata_save_path, "w") as f:
        json.dump(metadata, f, indent=2)
    print(f"  [SAVED] Exported dynamic class metadata to {metadata_save_path}")

    # Copy metadata to backend app dir if it exists
    backend_meta_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "backend", "app", "ml_service", "class_mappings.json")
    if os.path.exists(os.path.dirname(backend_meta_path)):
        with open(backend_meta_path, "w") as f:
            json.dump(metadata, f, indent=2)
        print(f"  [SAVED] Synchronized dynamic class metadata to {backend_meta_path}")

    crop_classes = metadata["crop_classes"]
    disease_classes = metadata["disease_classes"]

    random.seed(42)
    random.shuffle(all_samples)

    train_size = int(0.8 * len(all_samples))
    train_samples = all_samples[:train_size]
    val_samples   = all_samples[train_size:]

    train_ds = MultiTaskCropDataset(train_samples, transform=train_transform)
    val_ds   = MultiTaskCropDataset(val_samples,   transform=val_transform)

    train_loader = DataLoader(train_ds, batch_size=batch_size, shuffle=True,  num_workers=0)
    val_loader   = DataLoader(val_ds,   batch_size=batch_size, shuffle=False, num_workers=0)

    print(f"  Training samples  : {len(train_samples)}")
    print(f"  Validation samples: {len(val_samples)}\n")

    model = MultiTaskCropModel(
        num_crops=len(crop_classes),
        num_diseases=len(disease_classes),
        pretrained=True
    )
    model.to(device)

    crop_weights    = compute_class_weights(train_samples, len(crop_classes),    label_index=1).to(device)
    disease_weights = compute_class_weights(train_samples, len(disease_classes), label_index=2).to(device)

    crop_criterion    = nn.CrossEntropyLoss(weight=crop_weights)
    disease_criterion = nn.CrossEntropyLoss(weight=disease_weights)
    optimizer = optim.Adam(model.parameters(), lr=lr)
    scheduler = optim.lr_scheduler.StepLR(optimizer, step_size=3, gamma=0.5)

    best_val_loss = float('inf')

    for epoch in range(epochs):
        model.train()
        running_loss = correct_crops = correct_diseases = total = 0

        print(f"Epoch [{epoch+1}/{epochs}]  LR: {scheduler.get_last_lr()}")
        for images, crop_labels, disease_labels in tqdm(train_loader, desc="  Training"):
            images, crop_labels, disease_labels = (
                images.to(device), crop_labels.to(device), disease_labels.to(device)
            )
            optimizer.zero_grad()
            crop_logits, disease_logits = model(images)
            loss = crop_criterion(crop_logits, crop_labels) + disease_criterion(disease_logits, disease_labels)
            loss.backward()
            optimizer.step()

            running_loss      += loss.item() * images.size(0)
            correct_crops     += (crop_logits.argmax(1) == crop_labels).sum().item()
            correct_diseases  += (disease_logits.argmax(1) == disease_labels).sum().item()
            total             += images.size(0)

        print(f"  Train  -> Loss: {running_loss/total:.4f} | Crop Acc: {correct_crops/total*100:.2f}% | Disease Acc: {correct_diseases/total*100:.2f}%")

        # Validation
        model.eval()
        vl = vc_crop = vc_dis = vt = 0
        with torch.no_grad():
            for images, crop_labels, disease_labels in tqdm(val_loader, desc="  Validating"):
                images, crop_labels, disease_labels = (
                    images.to(device), crop_labels.to(device), disease_labels.to(device)
                )
                crop_logits, disease_logits = model(images)
                loss = crop_criterion(crop_logits, crop_labels) + disease_criterion(disease_logits, disease_labels)
                vl      += loss.item() * images.size(0)
                vc_crop += (crop_logits.argmax(1) == crop_labels).sum().item()
                vc_dis  += (disease_logits.argmax(1) == disease_labels).sum().item()
                vt      += images.size(0)

        val_loss = vl / vt
        print(f"  Val    -> Loss: {val_loss:.4f} | Crop Acc: {vc_crop/vt*100:.2f}% | Disease Acc: {vc_dis/vt*100:.2f}%\n")

        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), model_save_path)
            print(f"  [SAVED] Best model saved -> {model_save_path}\n")

        scheduler.step()

    print(f"\n{'='*60}")
    print(f"  TRAINING COMPLETE")
    print(f"  Best Validation Loss : {best_val_loss:.4f}")
    print(f"  Model saved at       : {model_save_path}")
    print(f"{'='*60}\n")


if __name__ == "__main__":
    train_model(epochs=12, lr=0.001)
