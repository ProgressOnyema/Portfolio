import { ButtonSocial } from "./Button";
import AppLink from "./Link";
import Grid from "./Grid";
import { LinkedInIcon, BehanceIcon } from "./Icons";

export default function ContactSection() {
  return (
    <Grid className="items-end gap-y-8 py-24 sm:py-40">
      <div className="col-span-4 flex flex-col gap-12 sm:col-span-8">
        <p className="text-body-lg-strong sm:text-h3-bold">
          Available for
          <br />
          projects
        </p>
        <div className="flex flex-col gap-1">
          <p className="text-body-lg-base sm:text-h3" style={{ color: "#858585" }}>
            Write to me
          </p>
          <AppLink variant="email" href="progressonyema5@gmail.com" />
        </div>
      </div>

      <div className="col-span-4 flex items-center gap-[15px] sm:col-span-4 sm:justify-end">
        <ButtonSocial href="https://linkedin.com" target="_blank" rel="noreferrer">
          <LinkedInIcon />
        </ButtonSocial>
        <ButtonSocial href="https://behance.net" target="_blank" rel="noreferrer">
          <BehanceIcon />
        </ButtonSocial>
      </div>
    </Grid>
  );
}
