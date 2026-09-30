# Mapping of crop + condition to recommendations, medicine, fertilizer adjustments, and descriptions.

RECOMMENDATIONS = {
    "corn": {
        "healthy": {
            "title": "Healthy Corn Leaf",
            "description": "The leaf shows no signs of disease or pest damage. Photosynthesis and growth rates are optimal.",
            "treatments": ["No active chemical treatment needed."],
            "medicine": {
                "name": "N/A (Organic preventive sprays only)",
                "dosage": "N/A",
                "frequency": "N/A",
                "instructions": "Apply Neem Oil (0.03%) as a biopesticide spray once a month if pest pressure increases nearby."
            },
            "fertilizer": {
                "npk": "Apply balanced N-P-K (120:60:40 kg/hectare). Split Nitrogen application.",
                "micronutrients": "Zinc Sulfate (25 kg/hectare) to prevent white bud symptoms.",
                "organic": "Add 10-15 tons of well-decomposed Farmyard Manure (FYM) per hectare during land preparation."
            },
            "preventive": ["Maintain regular watering schedule avoiding waterlogging.", "Practice crop rotation to prevent soil-borne pathogens."],
            "severity_factor": 0.0
        },
        "common_rust": {
            "title": "Common Rust (Puccinia sorghi)",
            "description": "Characterized by golden-brown pustules on both upper and lower leaf surfaces. Caused by a fungus favored by cool, moist conditions.",
            "treatments": ["Apply systemic fungicides if infection exceeds 5% of leaf area.", "Destroy infected crop debris immediately after harvest."],
            "medicine": {
                "name": "Propiconazole 25% EC (e.g., Tilt) or Tebuconazole 250 EC",
                "dosage": "2.0 ml per liter of water",
                "frequency": "Spray at 10-15 day intervals depending on wetness",
                "instructions": "Ensure complete coverage of both upper and lower leaf surfaces."
            },
            "fertilizer": {
                "npk": "Reduce Nitrogen top-dressing as excess N makes foliage lush and susceptible. Increase Potassium (MOP) by 15-20% to harden plant cells.",
                "micronutrients": "Foliar spray of Zinc and Magnesium to boost leaf recovery.",
                "organic": "Incorporate Trichoderma-viride enriched compost into the soil."
            },
            "preventive": ["Plant rust-resistant corn hybrids.", "Ensure proper spacing between crops to improve air circulation."],
            "severity_factor": 1.2
        },
        "gray_leaf_spot": {
            "title": "Gray Leaf Spot (Cercospora zeae-maydis)",
            "description": "Recognized by rectangular, pale brown or gray lesions running parallel to leaf veins. Flourishes in warm, humid conditions.",
            "treatments": ["Apply strobilurin or triazole fungicides at first sign of disease in high-yield fields.", "Minimize tillage in infected fields for next season."],
            "medicine": {
                "name": "Pyraclostrobin 20% WG (Headline) or Azoxystrobin 23% SC",
                "dosage": "1.5 g (WG) or 1.0 ml (SC) per liter of water",
                "frequency": "Repeat after 14 days if warm, damp weather continues",
                "instructions": "Apply early in the morning. Avoid spraying under hot midday sun."
            },
            "fertilizer": {
                "npk": "Maintain moderate Nitrogen levels; avoid late-season urea top-dressing. Keep Phosphorus and Potassium balanced.",
                "micronutrients": "Apply Borax (10 kg/hectare) to improve plant vascular strength.",
                "organic": "Apply neem cake powder to the soil to suppress fungal spores."
            },
            "preventive": ["Use resistant hybrids.", "Rotate crops with non-host species (e.g., soybeans) for at least one year."],
            "severity_factor": 1.5
        },
        "northern_leaf_blight": {
            "title": "Northern Leaf Blight (Exserohilum turcicum)",
            "description": "Characterized by long, elliptical, grayish-green or tan lesions (often cigar-shaped). Favored by moderate temperatures and wet weather.",
            "treatments": ["Foliar fungicides should be applied early if severe infection is detected before tasseling.", "Destroy crop residue post-harvest."],
            "medicine": {
                "name": "Mancozeb 75% WP or Carbendazim 50% WP",
                "dosage": "2.5 g (Mancozeb) or 1.0 g (Carbendazim) per liter of water",
                "frequency": "Every 10-12 days at first symptom detection",
                "instructions": "Mix with a wetting agent (sticker) to ensure the spray adheres to the vertical leaves."
            },
            "fertilizer": {
                "npk": "Apply standard recommended NPK. Do not exceed Nitrogen limits.",
                "micronutrients": "Foliar spray of Ferrous Sulfate (0.5%) if yellowing occurs alongside lesions.",
                "organic": "Apply humic acid (soil drench) to increase root nutrient uptake and plant vigor."
            },
            "preventive": ["Select resistant hybrids.", "Rotate crops to prevent overwintering fungi in crop residue."],
            "severity_factor": 1.4
        }
    },
    "potato": {
        "healthy": {
            "title": "Healthy Potato Leaf",
            "description": "No visible lesions or yellowing. Tuber development is expected to proceed normally.",
            "treatments": ["No active chemical treatment needed."],
            "medicine": {"name": "N/A", "dosage": "N/A", "frequency": "N/A", "instructions": "No curative chemical application required."},
            "fertilizer": {
                "npk": "Basal application of NPK (150:80:120 kg/hectare). Supplement Potassium at tuber bulk stage.",
                "micronutrients": "Magnesium Sulfate (25 kg/hectare) to prevent interveinal chlorosis.",
                "organic": "Incorporate vermicompost (5 tons/hectare) for soil moisture retention."
            },
            "preventive": ["Monitor soil moisture levels closely.", "Implement hilling to protect developing tubers."],
            "severity_factor": 0.0
        },
        "early_blight": {
            "title": "Early Blight (Alternaria solani)",
            "description": "Dark spots with concentric rings (target-like appearance) on older leaves. Can lead to significant defoliation.",
            "treatments": ["Apply protectant fungicides early in the season.", "Improve plant vigor through proper nitrogen management."],
            "medicine": {
                "name": "Chlorothalonil 75% WP or Copper Oxychloride 50% WP",
                "dosage": "2.0 g (Chlorothalonil) or 3.0 g (Copper Oxychloride) per liter of water",
                "frequency": "Apply at 7-10 day intervals after plant canopy closes",
                "instructions": "Begin applications when lower leaves show first concentric spots."
            },
            "fertilizer": {
                "npk": "Maintain adequate Nitrogen levels, but increase Potassium to limit leaf spotting.",
                "micronutrients": "Foliar spray of Magnesium Sulfate (0.5%) to reduce plant stress.",
                "organic": "Spread organic mulch around the base to prevent soil splashing."
            },
            "preventive": ["Maintain optimal plant nutrition and hydration.", "Practice a 3-year crop rotation."],
            "severity_factor": 1.1
        },
        "late_blight": {
            "title": "Late Blight (Phytophthora infestans)",
            "description": "Dark, water-soaked lesions on leaves, often with a white moldy growth on the underside in humid weather.",
            "treatments": ["IMMEDIATE ACTION: Apply specialized late-blight systemic fungicides.", "Remove and destroy infected plants and tubers immediately."],
            "medicine": {
                "name": "Metalaxyl 8% + Mancozeb 64% WP (e.g., Ridomil Gold) or Cymoxanil + Mancozeb",
                "dosage": "2.5 g per liter of water",
                "frequency": "Spray immediately. Repeat at 5-7 day intervals in cool, humid weather",
                "instructions": "Ensure immediate, thorough coverage of entire crop canopy."
            },
            "fertilizer": {
                "npk": "Stop all Nitrogen applications immediately as it accelerates soft vegetative growth. Apply Potassium Sulfate.",
                "micronutrients": "Calcium Nitrate foliar spray to reinforce tuber cell structures.",
                "organic": "Avoid fresh animal manure application. Use fully sterilized compost."
            },
            "preventive": ["Plant certified disease-free seed tubers.", "Avoid overhead irrigation; keep foliage dry."],
            "severity_factor": 2.0
        }
    },
    "rice": {
        "healthy": {
            "title": "Healthy Rice Leaf",
            "description": "Bright green, upright leaves showing active photosynthesis. Suggests healthy root system.",
            "treatments": ["No active chemical treatment needed."],
            "medicine": {"name": "N/A", "dosage": "N/A", "frequency": "N/A", "instructions": "Keep water levels at standard 2-5 cm depth."},
            "fertilizer": {
                "npk": "Apply split Nitrogen (120 kg/hectare total). Apply MOP (60 kg/ha).",
                "micronutrients": "Zinc Sulfate (25 kg/ha) is mandatory in flooded soils to prevent Khaira disease.",
                "organic": "Incorporate green manure (like Dhaincha) before transplanting."
            },
            "preventive": ["Maintain proper water levels.", "Apply split applications of nitrogen fertilizer."],
            "severity_factor": 0.0
        },
        "brown_spot": {
            "title": "Brown Spot (Bipolaris oryzae)",
            "description": "Oval, brown spots with gray or whitish centers. Often associated with nutrient-deficient soil.",
            "treatments": ["Correct soil nutrient deficiencies (especially Potassium).", "Apply registered foliar fungicides if infection is severe."],
            "medicine": {
                "name": "Hexaconazole 5% EC or Propiconazole 25% EC",
                "dosage": "2.0 ml per liter of water",
                "frequency": "Once at tillering stage and once at booting stage",
                "instructions": "Prioritize treatment if spots begin spreading to upper leaves (flag leaf)."
            },
            "fertilizer": {
                "npk": "URGENT: Immediately apply Muriate of Potash (MOP) at 30-40 kg/acre and ensure balanced Nitrogen.",
                "micronutrients": "Apply Zinc Sulfate (10 kg/acre) and Silicon-based fertilizer (20 kg/acre).",
                "organic": "Apply well-matured compost or bio-fertilizers (Azospirillum)."
            },
            "preventive": ["Use balanced fertilizer schedules.", "Avoid drought stress by ensuring consistent water supply."],
            "severity_factor": 1.2
        },
        "leaf_blast": {
            "title": "Leaf Blast (Magnaporthe oryzae)",
            "description": "Spindle-shaped spots with gray or white centers and reddish-brown borders. Favored by high humidity.",
            "treatments": ["Apply systemic fungicides at first detection.", "Immediately suspend nitrogen applications."],
            "medicine": {
                "name": "Tricyclazole 75% WP (e.g., Beam) or Isoprothiolane 40% EC",
                "dosage": "0.6 g (Tricyclazole) or 1.5 ml (Isoprothiolane) per liter of water",
                "frequency": "Spray at first sign. Repeat after 10-14 days if humidity is >90%",
                "instructions": "Ensure fine mist application for complete coverage."
            },
            "fertilizer": {
                "npk": "IMMEDIATELY STOP all Nitrogen (Urea) applications.",
                "micronutrients": "Apply Soluble Silica (2-3 ml/liter foliar) to form a physical barrier.",
                "organic": "Avoid applying fresh organic matter in flooded fields during active blast outbreaks."
            },
            "preventive": ["Avoid excessive nitrogen inputs.", "Maintain continuous shallow flooding."],
            "severity_factor": 1.6
        },
        "neck_blast": {
            "title": "Neck Blast (Magnaporthe oryzae)",
            "description": "Infection at the neck node causing the panicle to turn gray and fall over.",
            "treatments": ["Apply protective fungicides during early heading.", "Harvest early if neck blast is widespread."],
            "medicine": {
                "name": "Tricyclazole 75% WP or Kasugamycin 3% SL",
                "dosage": "0.6 g (Tricyclazole) or 2.0 ml (Kasugamycin) per liter of water",
                "frequency": "CRITICAL TIMING: Spray at 5% panicle emergence and repeat at full heading",
                "instructions": "Target the spray directly at the neck node."
            },
            "fertilizer": {
                "npk": "Restrict late top-dressing Nitrogen. Top-dress with Muriate of Potash (MOP).",
                "micronutrients": "Silicon applications are highly recommended during booting stage.",
                "organic": "Ensure no nitrogen-heavy organic inputs are added past tillering."
            },
            "preventive": ["Use blast-resistant rice varieties.", "Proper spacing and water management."],
            "severity_factor": 1.9
        }
    }
}

def build_dynamic_recommendation(crop: str, condition: str, cond_key: str):
    """
    Dynamically generates tailored recommendations, medicine dosages, NPK fertilizer formulas, 
    and preventive steps for ANY crop and disease condition.
    """
    is_healthy = "healthy" in cond_key or "fresh" in cond_key
    crop_cap = crop.capitalize()
    
    # Strip crop prefix if cond_key starts with it
    clean_cond = cond_key
    if clean_cond.startswith(f"{crop.lower()}_"):
        clean_cond = clean_cond[len(crop) + 1:]
    
    cond_title = clean_cond.replace("_", " ").title()
    
    if is_healthy:
        return {
            "title": f"Healthy {crop_cap} Leaf",
            "description": f"The {crop_cap} leaf shows optimal green pigment with no active disease lesions or pest stress.",
            "treatments": ["No active chemical treatment required."],
            "medicine": {
                "name": "N/A (Organic biopesticide preventive only)",
                "dosage": "N/A",
                "frequency": "N/A",
                "instructions": "Optionally apply Neem Oil (0.03%) once a month as preventive pest shield."
            },
            "fertilizer": {
                "npk": f"Maintain recommended baseline N-P-K ratio for {crop_cap} growth stage.",
                "micronutrients": "Foliar zinc sulfate (0.5%) + magnesium spray to sustain high photosynthetic rate.",
                "organic": "Incorporate well-composted organic FYM or vermicompost into root zone."
            },
            "preventive": [
                "Maintain regular, even irrigation avoiding waterlogging.",
                "Ensure proper crop spacing for sunlight penetration and canopy airflow."
            ],
            "severity_factor": 0.0
        }
        
    # Categorize by disease type keywords
    ck = clean_cond.lower()
    
    # 1. Downy / Powdery Mildew
    if "mildew" in ck:
        m_type = "Powdery Mildew" if "powdery" in ck or "powder" in ck else "Downy Mildew"
        return {
            "title": f"{m_type} on {crop_cap}",
            "description": f"Characterized by fine white powdery patches or grayish-white downy growth on {crop_cap} leaf surfaces.",
            "treatments": [
                f"Apply targeted antifungal spray to halt spore dispersal on {crop_cap} foliage.",
                "Prune dense lower leaves to reduce humidity microclimates."
            ],
            "medicine": {
                "name": "Wettable Sulfur 80% WP (for Powdery) or Metalaxyl 8% + Mancozeb 64% WP (for Downy)",
                "dosage": "2.5 g per liter of water",
                "frequency": "Spray immediately upon first symptom; repeat after 7-10 days if humid",
                "instructions": "Spray early morning or late afternoon. Ensure thorough coverage of lower leaf undersides."
            },
            "fertilizer": {
                "npk": f"Reduce excess Nitrogen top-dressing on {crop_cap}; lush vegetative tissue accelerates mildew invasion. Maintain Potash.",
                "micronutrients": "Foliar spray of Magnesium Sulfate (0.5%) to restore chlorotic leaf zones.",
                "organic": "Spray Neem seed kernel extract (NSKE 5%) or Potassium Bicarbonate solution."
            },
            "preventive": [
                "Avoid overhead irrigation; keep leaf foliage dry.",
                "Use wider row spacing to improve canopy ventilation."
            ],
            "severity_factor": 1.3
        }

    # 2. Rusts
    elif "rust" in ck or "ferrugen" in ck:
        return {
            "title": f"Rust Infection ({cond_title}) on {crop_cap}",
            "description": f"Identified by orange, reddish-brown, or yellow pustules bursting through the {crop_cap} leaf epidermis.",
            "treatments": [
                "Apply systemic triazole fungicide to protect the upper functional leaves.",
                "Remove volunteer host weeds along field borders."
            ],
            "medicine": {
                "name": "Propiconazole 25% EC (Tilt) or Tebuconazole 250 EC (Folicur)",
                "dosage": "1.5 to 2.0 ml per liter of water",
                "frequency": "Apply immediately; repeat after 12-14 days if rust spreads",
                "instructions": "Ensure uniform foliar coverage across the entire field canopy."
            },
            "fertilizer": {
                "npk": f"Temporarily restrict Nitrogen inputs. Increase Potassium (MOP) by 20% to harden leaf cell walls.",
                "micronutrients": "Foliar Zinc Sulfate (0.5%) + Ferrous Sulfate (0.5%) to aid chlorophyll synthesis.",
                "organic": "Soil application of Trichoderma viride enriched compost."
            },
            "preventive": [
                "Plant rust-tolerant cultivars.",
                "Manage planting dates to avoid high seasonal humidity windows."
            ],
            "severity_factor": 1.5
        }

    # 3. Viruses / Mosaics / Crinkle / Virosis
    elif any(w in ck for w in ["virus", "mosaic", "mossaic", "virosis", "crinkle", "crinckle", "curl"]):
        return {
            "title": f"Viral Infection ({cond_title}) on {crop_cap}",
            "description": f"Mottled yellowing, leaf crinkling, stunting, or mosaic patterns caused by viral pathogens spread by insect vectors.",
            "treatments": [
                f"Uproot and destroy severely infected {crop_cap} plants to prevent field-wide viral spread.",
                "Spray systemic insecticides to eliminate whitefly, thrips, or aphid vectors."
            ],
            "medicine": {
                "name": "Thiamethoxam 25% WG or Imidacloprid 17.8% SL (Vector Control)",
                "dosage": "0.5 g (Thiamethoxam) or 0.3 ml (Imidacloprid) per liter of water",
                "frequency": "Apply every 10 days to control sap-sucking vector insects",
                "instructions": "Note: Chemicals control vector insects, not the virus directly. Prompt vector control is critical."
            },
            "fertilizer": {
                "npk": f"Maintain balanced N-P-K (100:50:50 kg/ha). Avoid excess Urea which attracts sap-sucking insects.",
                "micronutrients": "Foliar spray of Soluble Boron and Zinc to strengthen vascular resilience.",
                "organic": "Install yellow sticky traps (15-20/acre) and apply Neem Oil (0.03%)."
            },
            "preventive": [
                "Use certified virus-free seed stock.",
                "Keep field borders clean of weed hosts."
            ],
            "severity_factor": 1.6
        }

    # 4. Bacterial Blight / Rot / Canker
    elif "bacterial" in ck or "xanthomonas" in ck:
        return {
            "title": f"Bacterial Infection ({cond_title}) on {crop_cap}",
            "description": f"Water-soaked lesions, bacterial oozing, or sharp yellow-bordered leaf stripes on {crop_cap}.",
            "treatments": [
                "Prune infected foliage using disinfected tools.",
                "Apply bactericide and copper combination spray."
            ],
            "medicine": {
                "name": "Streptocycline (100 ppm) + Copper Oxychloride 50% WP",
                "dosage": "0.1 g (Streptocycline) + 2.5 g (Copper Oxychloride) per liter of water",
                "frequency": "Apply twice with a 10-day gap at first detection",
                "instructions": "Spray during cool morning hours after dew has evaporated."
            },
            "fertilizer": {
                "npk": f"Avoid pure Urea top-dressing. Use Calcium Ammonium Nitrate (CAN) and supplement Potash.",
                "micronutrients": "Foliar Calcium Nitrate (0.5%) to reinforce cell wall structural integrity.",
                "organic": "Soil drench of Pseudomonas fluorescens (10 g/liter of water)."
            },
            "preventive": [
                "Disinfect farm tools and boots between fields.",
                "Avoid working in wet fields to prevent bacterial spread."
            ],
            "severity_factor": 1.6
        }

    # 5. Insects / Pests / Caterpillar / Borer / Miner / Scale / Scars
    elif any(w in ck for w in ["caterpillar", "borer", "miner", "leafminner", "scale", "insect", "scars"]):
        return {
            "title": f"Pest / Insect Damage ({cond_title}) on {crop_cap}",
            "description": f"Leaf mining tracks, chewed margins, pod borings, or sap-depleting scale insects on {crop_cap}.",
            "treatments": [
                f"Apply targeted bio-pesticide or eco-friendly insecticide to halt pest feeding on {crop_cap}.",
                "Handpick caterpillars or egg masses where feasible."
            ],
            "medicine": {
                "name": "Emamectin Benzoate 5% SG or Spinosad 45% SC",
                "dosage": "0.4 g (Emamectin) or 0.3 ml (Spinosad) per liter of water",
                "frequency": "Apply when pest count exceeds economic threshold",
                "instructions": "Direct spray into leaf whorls, lower leaf surfaces, and pod attachment sites."
            },
            "fertilizer": {
                "npk": f"Maintain recommended NPK balance. Excessive Nitrogen makes leaf tissue too soft and attractive to chewing pests.",
                "micronutrients": "Apply Ortho-silicic acid (Silica spray, 2.0 ml/L) to harden leaf cuticle layer against pest chewing.",
                "organic": "Release Trichogramma egg parasitoids or spray Bacillus thuringiensis (Bt)."
            },
            "preventive": [
                "Install pheromone traps for pest monitoring.",
                "Maintain clean field perimeters and weed sanitation."
            ],
            "severity_factor": 1.3
        }

    # 6. Dryness / Deficiency / Physiological Stress
    elif any(w in ck for w in ["dryness", "deficiency", "magnesium", "yellowing"]):
        return {
            "title": f"Nutrient Deficiency / Stress ({cond_title}) on {crop_cap}",
            "description": f"Interveinal chlorosis, leaf tip desiccation, or mineral deficiency symptoms on {crop_cap}.",
            "treatments": [
                f"Replenish missing micronutrients and correct soil moisture balance for {crop_cap}.",
                "Apply targeted foliar micronutrient spray for rapid absorption."
            ],
            "medicine": {
                "name": "Foliar Micronutrient Mixture (Magnesium Sulfate / Zinc Sulfate / Borax)",
                "dosage": "5.0 g to 10.0 g per liter of water",
                "frequency": "Apply twice with a 7-day interval",
                "instructions": "Ensure soil is adequately moist prior to applying foliar sprays."
            },
            "fertilizer": {
                "npk": f"Supplement Potassium (K2O) to improve osmotic water retention in {crop_cap}.",
                "micronutrients": "Magnesium Sulfate (25 kg/ha soil application) + Zinc Sulfate foliar spray.",
                "organic": "Apply thick organic mulch (straw/compost) around root zone to retain soil moisture."
            },
            "preventive": [
                "Conduct routine soil chemical testing.",
                "Maintain high soil organic matter levels."
            ],
            "severity_factor": 1.0
        }

    # 7. General Fungal Blight / Spot / Rot / Mold / Anthracnose / Algal / Stemphylium / Septoria
    else:
        return {
            "title": f"{cond_title} on {crop_cap}",
            "description": f"Active {cond_title} lesions or necrotic fungal spotting identified on {crop_cap} foliage.",
            "treatments": [
                f"Prune severely spotted or blighted {crop_cap} leaves to minimize fungal spore load.",
                "Apply broad-spectrum protective fungicide."
            ],
            "medicine": {
                "name": "Mancozeb 75% WP (e.g., Dithane M-45) or Azoxystrobin 23% SC",
                "dosage": "2.5 g (Mancozeb) or 1.0 ml (Azoxystrobin) per liter of water",
                "frequency": "Apply every 10-14 days during wet or humid weather",
                "instructions": "Apply during early morning hours; ensure thorough coverage of both leaf surfaces."
            },
            "fertilizer": {
                "npk": f"Reduce excess Nitrogen top-dressing on {crop_cap}. Increase Potassium (MOP) by 15-20% to harden tissue.",
                "micronutrients": "Foliar spray of Zinc Sulfate (0.5%) + Boron (0.2%) to accelerate leaf recovery.",
                "organic": "Soil application of Trichoderma viride bio-fungicide enriched compost."
            },
            "preventive": [
                "Avoid overhead irrigation; keep foliage dry.",
                "Practice systematic crop rotation."
            ],
            "severity_factor": 1.4
        }


def get_recommendation(crop: str, condition: str):
    crop_key = crop.lower().strip()
    cond_key = condition.lower().replace(" ", "_").replace("___", "_").strip()
    
    # Check hardcoded exact recommendation templates first
    crop_data = RECOMMENDATIONS.get(crop_key, {})
    rec = crop_data.get(cond_key)
    
    # Try fuzzy matching in crop_data keys
    if not rec:
        for k, v in crop_data.items():
            if k in cond_key or cond_key in k:
                rec = v
                break
                
    # If not found in hardcoded templates, build a dynamic, customized recommendation
    if not rec:
        rec = build_dynamic_recommendation(crop_key, condition, cond_key)
        
    return rec
