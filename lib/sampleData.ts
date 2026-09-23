import { PlantDiagnosis } from "@/types/diagnosis";

export interface SampleLeaf {
  id: string;
  name: string;
  crop: string;
  disease: string;
  imageUrl: string;
  diagnosis: PlantDiagnosis;
}

export const SAMPLE_PLANTS: SampleLeaf[] = [
  {
    id: "sample-tomato-blight",
    name: "Tomato Early Blight",
    crop: "Tomato",
    disease: "Early Blight (Alternaria solani)",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80",
    diagnosis: {
      id: "diag-sample-1",
      timestamp: Date.now() - 3600000,
      imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d6910985b?auto=format&fit=crop&w=800&q=80",
      plantName: "Tomato (Solanum lycopersicum)",
      condition: "Early Blight (Alternaria solani)",
      isHealthy: false,
      severity: "Urgent",
      confidence: 96,
      description:
        "Classic concentric dark brown 'bullseye' rings observed on lower foliar tissue, accompanied by chlorotic yellow halos. Pathogen progresses upward rapidly in warm, humid weather.",
      pathogen: "Fungal (Alternaria solani)",
      symptoms: [
        "Concentric target-like rings on older leaves",
        "Progressive yellowing (chlorosis) around lesions",
        "Premature defoliation of lower stems",
        "Sunscald risk on developing fruit"
      ],
      causes:
        "High relative humidity (>80%) combined with prolonged leaf wetness from overhead splashing or rain. Spores overwinter in soil and infected plant debris.",
      immediateAction:
        "Prune and safely discard all infected lower foliage immediately. Never compost blighted plant matter.",
      organicTreatment: [
        "Apply certified organic copper octanoate fungicide every 7 to 10 days.",
        "Spray cold-pressed neem oil (0.5% solution) or potassium bicarbonate early in the morning.",
        "Add a 2-inch organic straw or bark mulch layer around the base to prevent soil splash."
      ],
      chemicalTreatment: [
        "Foliar application of Chlorothalonil or Mancozeb as protective barrier spray.",
        "For systemic control in commercial cultivation, alternate Azoxystrobin (FRAC 11) with Boscalid (FRAC 7) to avoid resistance."
      ],
      prevention: [
        "Switch to ground-level drip or soaker hose irrigation to keep leaves completely dry.",
        "Maintain minimum 24-inch spacing between tomato vines for optimal airflow.",
        "Practice a strict 3-year crop rotation avoiding Solanaceae family (peppers, potatoes, eggplants)."
      ],
      metrics: {
        nitrogen: "Deficient",
        moisture: "High",
        spreadRisk: "High"
      }
    }
  },
  {
    id: "sample-corn-rust",
    name: "Corn Common Rust",
    crop: "Corn / Maize",
    disease: "Common Rust (Puccinia sorghi)",
    imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
    diagnosis: {
      id: "diag-sample-2",
      timestamp: Date.now() - 7200000,
      imageUrl: "https://images.unsplash.com/photo-1551754655-cd27e38d2076?auto=format&fit=crop&w=800&q=80",
      plantName: "Sweet Corn / Maize (Zea mays)",
      condition: "Common Rust (Puccinia sorghi)",
      isHealthy: false,
      severity: "Moderate",
      confidence: 93,
      description:
        "Prominent cinnamon-brown to golden-orange powdery pustules (uredinia) scattered across upper and lower leaf blades. Pustules rupture epidermal leaf tissue, leading to moisture loss.",
      pathogen: "Fungal (Puccinia sorghi)",
      symptoms: [
        "Elongated reddish-brown pustules on both leaf surfaces",
        "Powdery rust spores rubbing off on touch",
        "Leaf chlorosis and tip dieback under high infection load",
        "Stunted ear development if infection occurs before silking"
      ],
      causes:
        "Cool to moderate temperatures (60-75°F / 16-24°C) with high humidity and morning dew. Spores are windblown over long distances from southern regions.",
      immediateAction:
        "Inspect canopy distribution to gauge threshold. If pustules appear prior to tasseling on upper leaves, prepare fungicide intervention.",
      organicTreatment: [
        "Foliar bio-fungicide containing Bacillus subtilis (e.g., Serenade ASO).",
        "Sulfur dust or wettable sulfur applied at earliest pustule onset (avoid when temps exceed 85°F).",
        "Compost tea spray with beneficial fungal competitors."
      ],
      chemicalTreatment: [
        "Foliar application of Pyraclostrobin (Headline) or Propiconazole (Tilt).",
        "Dual-action triazole + strobilurin blend applied at VT (tasseling) stage."
      ],
      prevention: [
        "Plant certified resistant corn hybrids (carrying Rp gene resistance).",
        "Plant early in the season to mature past peak windborne spore migration.",
        "Deep-till infected crop residue after autumn harvest."
      ],
      metrics: {
        nitrogen: "Optimal",
        moisture: "High",
        spreadRisk: "Moderate"
      }
    }
  },
  {
    id: "sample-healthy-pepper",
    name: "Healthy Bell Pepper",
    crop: "Bell Pepper",
    disease: "None (Healthy & Vigorous)",
    imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
    diagnosis: {
      id: "diag-sample-3",
      timestamp: Date.now() - 10800000,
      imageUrl: "https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?auto=format&fit=crop&w=800&q=80",
      plantName: "Bell Pepper (Capsicum annuum)",
      condition: "Healthy Foliage & Optimal Vigor",
      isHealthy: true,
      severity: "Healthy",
      confidence: 99,
      description:
        "Deep glossy green leaf coloration with uniform chlorophyll density. Leaf margin is smooth, veins are structurally sound with zero chlorosis, necrotic spotting, or pest damage.",
      pathogen: "None (Zero Pathogens Detected)",
      symptoms: [
        "Uniform rich emerald green pigmentation",
        "Firm leaf turgidity without wilt or curling",
        "Clean abaxial (underside) surfaces free of mites or aphids",
        "Robust apical stem elongation"
      ],
      causes:
        "Balanced soil nutrients, optimal drainage, consistent sunlight (6-8 hours daily), and proper root aeration.",
      immediateAction:
        "Maintain current watering and organic feeding regimen. Continue regular scouting.",
      organicTreatment: [
        "Side-dress with balanced aged compost or worm castings once a month.",
        "Periodic foliar kelp extract spray to boost heat and drought tolerance."
      ],
      chemicalTreatment: [
        "No chemical intervention needed. Maintain preventive pest traps (yellow sticky cards)."
      ],
      prevention: [
        "Consistent soil moisture (1-2 inches per week) to prevent blossom-end rot.",
        "Ensure soil pH remains in the optimal 6.2 - 6.8 range.",
        "Mulch bed with organic straw to conserve root temperature."
      ],
      metrics: {
        nitrogen: "Optimal",
        moisture: "Optimal",
        spreadRisk: "Low"
      }
    }
  }
];
