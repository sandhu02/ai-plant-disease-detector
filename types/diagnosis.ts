export interface DiagnosisMetrics {
  nitrogen: "Low" | "Optimal" | "Deficient" | "Excess";
  moisture: "Low" | "Optimal" | "High";
  spreadRisk: "Low" | "Moderate" | "High";
}

export interface PlantDiagnosis {
  id: string;
  timestamp: number;
  imageUrl: string;
  plantName: string;
  condition: string;
  isHealthy: boolean;
  severity: "Healthy" | "Mild" | "Moderate" | "Urgent";
  confidence: number;
  description: string;
  pathogen: "Fungal" | "Bacterial" | "Viral" | "Pest" | "Nutrient" | "Environmental" | "None" | string;
  symptoms: string[];
  causes: string;
  immediateAction: string;
  organicTreatment: string[];
  chemicalTreatment: string[];
  prevention: string[];
  metrics: DiagnosisMetrics;
}
