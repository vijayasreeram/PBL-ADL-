import torch
import torch.nn as nn
import torchvision.models as models

class MultiTaskCropModel(nn.Module):
    def __init__(self, num_crops=5, num_diseases=13, pretrained=True):
        super(MultiTaskCropModel, self).__init__()
        # Use lightweight MobileNetV3 Small as backbone
        if pretrained:
            self.backbone = models.mobilenet_v3_small(weights=models.MobileNet_V3_Small_Weights.DEFAULT)
        else:
            self.backbone = models.mobilenet_v3_small()
            
        # Get the size of the feature vector before the classifier head
        in_features = self.backbone.classifier[0].in_features
        
        # Remove the default classifier
        self.backbone.classifier = nn.Identity()
        
        # Multi-task heads
        # Head 1: Crop Type Classification (5 classes)
        self.crop_head = nn.Sequential(
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_crops)
        )
        
        # Head 2: Disease Classification (13 classes)
        self.disease_head = nn.Sequential(
            nn.Linear(in_features, 256),
            nn.ReLU(),
            nn.Dropout(0.3),
            nn.Linear(256, num_diseases)
        )
        
    def forward(self, x):
        # Extract features
        features = self.backbone(x)
        
        # Get predictions from both heads
        crop_logits = self.crop_head(features)
        disease_logits = self.disease_head(features)
        
        return crop_logits, disease_logits
