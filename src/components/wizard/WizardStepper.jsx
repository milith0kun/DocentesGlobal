'use client';

import { stepLabels } from './config/wizard-config.js';

const totalSteps = 11;

export default function WizardStepper({ step }) {
  return (
    <div className="wz-stepper-premium">
      <div className="wz-stepper-info">
        <span className="wz-stepper-step-badge" title={stepLabels[step]}>
          Paso {step} de {totalSteps}
        </span>
      </div>
      <div className="wz-stepper-segments">
        {Array.from({ length: totalSteps }).map((_, idx) => {
          const segmentStep = idx + 1;
          const active = step === segmentStep;
          const done = step > segmentStep;
          return (
            <div
              key={idx}
              className={`wz-stepper-segment ${active ? 'active' : ''} ${done ? 'done' : ''}`}
            />
          );
        })}
      </div>
    </div>
  );
}
