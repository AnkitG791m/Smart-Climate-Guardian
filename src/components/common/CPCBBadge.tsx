import React from 'react';
import { useTranslation } from 'react-i18next';
import { CPCBCategory, getCPCBColorDetails } from '../../utils/cpcbAqi';

interface CPCBBadgeProps {
  category: CPCBCategory;
  aqiValue?: number;
  size?: 'sm' | 'md' | 'lg';
  showDot?: boolean;
}

export const CPCBBadge: React.FC<CPCBBadgeProps> = ({
  category,
  aqiValue,
  size = 'md',
  showDot = true,
}) => {
  const { i18n } = useTranslation();
  const isHindi = i18n.language === 'hi';
  const colorDetails = getCPCBColorDetails(category);

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 font-bold',
  };

  const label = isHindi ? colorDetails.labelHi : category;

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border transition-all ${sizeClasses[size]}`}
      style={{
        backgroundColor: colorDetails.bgLight,
        color: colorDetails.textColor,
        borderColor: `${colorDetails.color}55`,
      }}
    >
      {showDot && (
        <span className="relative flex h-2 w-2">
          <span
            className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75"
            style={{ backgroundColor: colorDetails.color }}
          ></span>
          <span
            className="relative inline-flex rounded-full h-2 w-2"
            style={{ backgroundColor: colorDetails.color }}
          ></span>
        </span>
      )}
      <span>{label}</span>
      {typeof aqiValue === 'number' && (
        <span className="font-mono opacity-80">({aqiValue})</span>
      )}
    </span>
  );
};
