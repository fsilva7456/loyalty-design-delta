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
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';

interface StepFormProps {
  step: string;
  onSubmit: (data: any) => Promise<void>;
  onRegenerate?: (feedback: string) => Promise<void>;
  result: any;
  previousStepResults?: Record<string, any>;
}

interface FormData {
  company_name?: string;
  industry?: string;
}

[Previous content remains the same until the final RegenerationModal component...]

        {onRegenerate && (
          <RegenerationModal
            isOpen={isRegenerationModalOpen}
            onClose={() => setIsRegenerationModalOpen(false)}
            onSubmit={handleRegenerate}
            title={`Regenerate ${step.replace('_', ' ').charAt(0).toUpperCase() + step.slice(1)}`}
          />
        )}
      </div>
    </div>
  );
}