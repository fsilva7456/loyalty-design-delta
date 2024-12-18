"use client";

import { useState, useEffect } from 'react';
import CustomerAnalysisForm from './CustomerAnalysisForm';
import CustomerAnalysisResult from './CustomerAnalysisResult';
import CompetitorAnalysisResult from './CompetitorAnalysisResult';
import LoyaltyObjectivesForm from './LoyaltyObjectivesForm';
import LoyaltyObjectivesResult from './LoyaltyObjectivesResult';
import LoyaltyMechanicsForm from './LoyaltyMechanicsForm';
import LoyaltyMechanicsResult from './LoyaltyMechanicsResult';
import CostEstimationForm from './CostEstimationForm';
import CostEstimationResult from './CostEstimationResult';
import RegenerationModal from '../RegenerationModal';
import type { RegenerationModalProps } from '../RegenerationModal';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

// [...rest of the file remains the same...]
