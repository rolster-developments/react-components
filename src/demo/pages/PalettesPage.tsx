import { RolsterListElement } from '@rolster/components';
import { useFormControl } from '@rolster/react-forms';
import { useEffect, useMemo, useRef, useState } from 'react';
import { RlsBallot, RlsCard, RlsFieldSelect } from '../../index';
import { RlsTheme } from '../../types';
import {
  PALETTE_STEPS,
  PALETTE_THEMES,
  REFERENCE_STEP,
  THEME_LAYER
} from '../data/palettes';
import {
  Oklch,
  paletteToken,
  rgbToHex,
  sortByHue,
  srgbToOklch,
  ThemeSwatch
} from '../helpers/palette';

import './PalettesPage.scss';

const THEME_OPTIONS = PALETTE_THEMES.map(
  (theme) => new RolsterListElement<RlsTheme>(theme)
);

function readToken(token: string): string {
  return getComputedStyle(document.body).getPropertyValue(token).trim();
}

interface MeasureProps {
  hex: string;
}

function Measure({ hex }: MeasureProps) {
  const { chroma, hue, lightness }: Oklch = srgbToOklch(hex);

  return (
    <span className="palettes-page__measure rls-caption-font">
      L {lightness.toFixed(1)} · C {chroma.toFixed(3)} · H {hue.toFixed(0)}°
    </span>
  );
}

export function PalettesPage() {
  const themeControl = useFormControl<RlsTheme>('amaizing');
  const theme = themeControl.value ?? 'amaizing';

  const [ramp, setRamp] = useState<string[]>([]);
  const [layer, setLayer] = useState<string[]>([]);
  const layerRef = useRef<HTMLDivElement>(null);

  const swatches = useMemo<ThemeSwatch[]>(
    () =>
      sortByHue(
        PALETTE_THEMES.map((item) => ({
          hex: readToken(paletteToken(item, REFERENCE_STEP)),
          theme: item
        }))
      ),
    []
  );

  useEffect(() => {
    setRamp(PALETTE_STEPS.map((step) => readToken(paletteToken(theme, step))));
  }, [theme]);

  useEffect(() => {
    const probes = layerRef.current?.querySelectorAll('.palettes-page__probe');

    setLayer(
      [...(probes ?? [])].map((probe) =>
        rgbToHex(getComputedStyle(probe).backgroundColor)
      )
    );
  }, [theme]);

  return (
    <section className="palettes-page">
      <div className="palettes-page__picker">
        <RlsFieldSelect
          formControl={themeControl}
          suggestions={THEME_OPTIONS}
          placeholder="Choose a palette"
        />
      </div>

      <div className="palettes-page__group">
        <span className="rls-label-font">
          Ramp · --rls-{theme}-color-050 … 950
        </span>

        <div className="palettes-page__ramp">
          {PALETTE_STEPS.map((step, index) => (
            <div key={step} className="palettes-page__step">
              <div
                className="palettes-page__chip"
                style={{ background: `var(${paletteToken(theme, step)})` }}
              />

              <span className="rls-caption-font">{step}</span>

              <span className="palettes-page__hex rls-caption-font">
                {ramp[index] || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div ref={layerRef} className="palettes-page__group" rls-theme={theme}>
        <span className="rls-label-font">
          Resolved layer · what a component actually reads
        </span>

        <div className="palettes-page__ramp">
          {THEME_LAYER.map(({ label, token }, index) => (
            <div key={token} className="palettes-page__step">
              <div
                className="palettes-page__chip palettes-page__probe"
                style={{ background: `var(${token})` }}
              />

              <span className="rls-caption-font">{label}</span>

              <span className="palettes-page__hex rls-caption-font">
                {layer[index] || '—'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="palettes-page__group">
        <span className="rls-label-font">
          Every palette at step {REFERENCE_STEP}, ordered by hue
        </span>

        <div className="palettes-page__wheel">
          {swatches.map(({ hex, theme: item }) => (
            <RlsCard key={item} className="palettes-page__entry">
              <div
                className="palettes-page__chip palettes-page__chip--wide"
                style={{ background: `var(${paletteToken(item, REFERENCE_STEP)})` }}
              />

              <RlsBallot subtitle={<Measure hex={hex} />}>
                <span className="rls-body-font-semibold">{item}</span>
              </RlsBallot>

              <span className="palettes-page__hex rls-caption-font">{hex}</span>
            </RlsCard>
          ))}
        </div>
      </div>
    </section>
  );
}
