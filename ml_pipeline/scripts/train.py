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

sys.path.append(os.path.join(os.path.dirname(__file__), "..", "..", "backend"))
from app.ml_service.model import MultiTaskCropModel
from ml_pipeline.scripts.train_full import discover_images

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

def train_model(epochs=5, batch_size=32, lr=0.001):
    device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
    print(f"Training on device: {device}")
    
    dataset_dir = os.path.join(
        os.path.dirname(os.path.dirname(__file__)), "data", "Crop___Disease"
    )
    model_save_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "models")
    os.makedirs(model_save_dir, exist_ok=True)
    model_save_path = os.path.join(model_save_dir, "best_model.pth")
    metadata_save_path = os.path.join(model_save_dir, "class_mappings.json")
    
    train_transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(15),
        transforms.ColorJitter(brightness=0.2, contrast=0.2),
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
        print("Error: No images found in dataset folder!")
        return
        
    with open(metadata_save_path, "w") as f:
        json.dump(metadata, f, indent=2)
        
    crop_classes = metadata["crop_classes"]
    disease_classes = metadata["disease_classes"]
        
    train_size = int(0.8 * len(all_samples))
    val_size = len(all_samples) - train_size
    
    random.seed(42)
    random.shuffle(all_samples)
    train_samples = all_samples[:train_size]
    val_samples = all_samples[train_size:]
    
    train_data = MultiTaskCropDataset(train_samples, transform=train_transform)
    val_data = MultiTaskCropDataset(val_samples, transform=val_transform)
    
    train_loader = DataLoader(train_data, batch_size=batch_size, shuffle=True, num_workers=0)
    val_loader = DataLoader(val_data, batch_size=batch_size, shuffle=False, num_workers=0)
    
    model = MultiTaskCropModel(num_crops=len(crop_classes), num_diseases=len(disease_classes), pretrained=True)
    model.to(device)
    
    crop_criterion = nn.CrossEntropyLoss()
    disease_criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=lr)
    
    best_val_loss = float('inf')
    
    for epoch in range(epochs):
        model.train()
        running_loss = correct_crops = correct_diseases = total = 0
        
        print(f"\nEpoch {epoch+1}/{epochs}")
        for images, crop_labels, disease_labels in tqdm(train_loader, desc="Training"):
            images, crop_labels, disease_labels = images.to(device), crop_labels.to(device), disease_labels.to(device)
            optimizer.zero_grad()
            crop_logits, disease_logits = model(images)
            loss_crop = crop_criterion(crop_logits, crop_labels)
            loss_disease = disease_criterion(disease_logits, disease_labels)
            total_loss = loss_crop + loss_disease
            total_loss.backward()
            optimizer.step()
            
            running_loss += total_loss.item() * images.size(0)
            correct_crops += (crop_logits.argmax(1) == crop_labels).sum().item()
            correct_diseases += (disease_logits.argmax(1) == disease_labels).sum().item()
            total += images.size(0)
            
        epoch_loss = running_loss / total
        print(f"Train Loss: {epoch_loss:.4f} | Crop Acc: {(correct_crops/total)*100:.2f}% | Disease Acc: {(correct_diseases/total)*100:.2f}%")
        
        model.eval()
        val_running_loss = val_correct_crops = val_correct_diseases = val_total = 0
        with torch.no_grad():
            for images, crop_labels, disease_labels in val_loader:
                images, crop_labels, disease_labels = images.to(device), crop_labels.to(device), disease_labels.to(device)
                crop_logits, disease_logits = model(images)
                total_loss = crop_criterion(crop_logits, crop_labels) + disease_criterion(disease_logits, disease_labels)
                val_running_loss += total_loss.item() * images.size(0)
                val_correct_crops += (crop_logits.argmax(1) == crop_labels).sum().item()
                val_correct_diseases += (disease_logits.argmax(1) == disease_labels).sum().item()
                val_total += images.size(0)
                
        val_loss = val_running_loss / val_total
        print(f"Val Loss: {val_loss:.4f} | Crop Val Acc: {(val_correct_crops/val_total)*100:.2f}% | Disease Val Acc: {(val_correct_diseases/val_total)*100:.2f}%")
        
        if val_loss < best_val_loss:
            best_val_loss = val_loss
            torch.save(model.state_dict(), model_save_path)
            print(f"--> Saved best model weights to {model_save_path}")

if __name__ == "__main__":
    train_model(epochs=5, lr=0.001)
