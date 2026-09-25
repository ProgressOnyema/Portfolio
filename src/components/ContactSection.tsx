import { ButtonSocial } from "./Button";
import AppLink from "./Link";
import Grid from "./Grid";
import { LinkedInIcon, BehanceIcon } from "./Icons";

export default function ContactSection() {
  const year = new Date().getFullYear();

  return (
    <>
      <Grid className="items-end gap-y-8 pt-24 pb-8 sm:pt-40 sm:pb-12">
        <div className="col-span-4 flex flex-col gap-12 sm:col-span-8">
          <p className="text-body-lg-strong sm:text-h3-bold">
            Available for
            <br />
            projects
          </p>
          <div className="flex flex-col gap-1">
            <p className="text-body-reg-base text-text-body sm:text-h3">
              Write to me:
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

      {/* Site-wide footer line. ContactSection sits at the bottom of every
          page, so this is where the copyright notice lives rather than a
          separate Footer component. */}
      <Grid className="pb-8 sm:pb-12">
        <p className="text-body-sm-base col-span-4 text-text-primary sm:col-span-12">
          ©{year} Onyema Miracle.
        </p>
      </Grid>
    </>
  );
}
