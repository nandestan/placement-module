export interface MaximumCompaniesPolicy {
    enabled: boolean;
    maxN: number;
}

export interface DreamOfferPolicy {
    enabled: boolean;
}

export interface DreamCompanyPolicy {
    enabled: boolean;
}

export interface CGPAThresholdPolicy {
    enabled: boolean;
    minimumCGPA: number;
    highSalaryThreshold: number;
}

export interface PlacementPercentagePolicy {
    enabled: boolean;
    targetPercentage: number;
}

export interface OfferCategoryPolicy {
    enabled: boolean;
    l1ThresholdAmount: number;
    l2ThresholdAmount: number;
    requiredHikePercentage: number;
}

export interface PolicyConfig {
    maximumCompanies: MaximumCompaniesPolicy;
    dreamOffer: DreamOfferPolicy;
    dreamCompany: DreamCompanyPolicy;
    cgpaThreshold: CGPAThresholdPolicy;
    placementPercentage: PlacementPercentagePolicy;
    offerCategory: OfferCategoryPolicy;
} 