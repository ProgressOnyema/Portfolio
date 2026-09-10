export type ExperienceItem = {
  period: string;
  role: string;
  company: string;
  description: string;
};

export default function ExperienceDesc({ item }: { item: ExperienceItem }) {
  return (
    <div className="flex flex-col items-start gap-3 border-b border-border-hairline pb-6 sm:flex-row sm:gap-32">
      <p className="text-body-reg-strong w-full sm:w-[127px] sm:shrink-0">{item.period}</p>
      <div className="flex w-full max-w-[689px] flex-col gap-3">
        <div className="text-body-lg-base flex flex-col gap-1">
          <p className="text-body-lg-strong">{item.role}</p>
          <p>{item.company}</p>
        </div>
        <p className="text-body-reg-base text-text-primary">{item.description}</p>
      </div>
    </div>
  );
}
