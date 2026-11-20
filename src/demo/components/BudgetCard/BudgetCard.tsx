import { RlsAmount, RlsCard, RlsIcon } from '../../../index';
import { Budget, BudgetKind } from '../../data/employees';

import './BudgetCard.scss';

const TREND_ICON: Record<BudgetKind, string> = {
  up: 'arrow-up',
  down: 'arrow-down',
  love: 'heart'
};

interface BudgetCardProps {
  budget: Budget;
}

export function BudgetCard({ budget }: BudgetCardProps) {
  const { active, label, trend, value } = budget;

  return (
    <RlsCard
      className="budget-card"
      rlsTheme={active ? 'primary' : undefined}
    >
      <div className="budget-card__header">
        <span className="rls-caption-font">{label}</span>

        <RlsIcon value={TREND_ICON[trend]} />
      </div>

      <RlsAmount value={value} decimals={2} symbol="$" />
    </RlsCard>
  );
}
