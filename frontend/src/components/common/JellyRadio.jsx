import React, { forwardRef, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { animate, motion, motionValue, useReducedMotion, useTransform } from 'framer-motion';

const DEFAULT_ITEMS = ['Off', 'Low', 'Medium', 'High', 'Max'];

const PRESETS = {
  levels: ['Off', 'Low', 'Medium', 'High', 'Max'],
  speed: ['0.5x', '1x', '1.5x', '2x'],
  priority: ['Low', 'Normal', 'High', 'Urgent'],
  status: ['Active', 'Paused', 'Completed'],
  views: ['List', 'Grid', 'Map'],
};

const SIZES = {
  sm: [28, 12, 12],
  md: [36, 13, 16],
  lg: [44, 14, 20]
};

const spring = (k, m, bounce) => ({
  type: 'spring',
  stiffness: k,
  damping: 2 * Math.sqrt(k * m) * (1 - bounce),
  mass: m
});

const Chip = forwardRef(function Chip({ mv, children, ...rest }, ref) {
  const transform = useTransform(
    () => `translate3d(${mv.x.get()}px, 0, 0) scale(${mv.sx.get()}, ${mv.sy.get()})`
  );
  return (
    <motion.button
      ref={ref}
      data-motion="true"
      style={{ transform, willChange: 'transform' }}
      {...rest}
    >
      {children}
    </motion.button>
  );
});

export default function JellyRadio({
  items = DEFAULT_ITEMS,
  value,
  defaultValue,
  onChange,
  // Existing project blue (#1A73E8) for active button, subtle neutral for chips
  chipColor = '#F0F4F9',
  activeColor = '#1A73E8',
  textColor = '#444746',
  activeTextColor = '#FFFFFF',
  size = 'md',
  gap = 8,
  radius = 18,
  swell = 0.2,
  barge = 6,
  shrink = 0.05,
  jelly = 1,
  bounce = 0.25,
  stagger = 22,
  stiffness = 580,
  disabled = false,
  ariaLabel = 'Options',
  className = ''
}) {
  // Normalize items whether passed as preset string, string array, or object array
  let rawList = DEFAULT_ITEMS;
  if (typeof items === 'string') {
    rawList = PRESETS[items.toLowerCase()] || DEFAULT_ITEMS;
  } else if (Array.isArray(items)) {
    rawList = items;
  }

  const list = rawList.map((it) => {
    if (typeof it === 'string' || typeof it === 'number') {
      return { value: String(it), label: String(it) };
    }
    return {
      value: it.value,
      label: it.label ?? String(it.value),
      icon: it.icon ?? null,
      disabled: !!it.disabled
    };
  });

  const [inner, setInner] = useState(() => defaultValue ?? list[0]?.value);
  const current = value ?? inner;
  const at = Math.max(
    0,
    list.findIndex((it) => it.value === current)
  );

  const reduce = useReducedMotion();
  const groupRef = useRef(null);
  const chipRefs = useRef([]);
  const widths = useRef([]);
  const mvs = useRef([]);
  const anims = useRef({});
  const applied = useRef(at);
  const cfg = useRef({});

  cfg.current = {
    swell,
    barge,
    shrink,
    jelly,
    bounce,
    stagger,
    stiffness,
    reduce,
    count: list.length
  };

  const [h, font, px] = SIZES[size] ?? SIZES.md;
  const itemsKey = list.map((it) => it.value).join('|');

  // Pre-calculated deterministic padding so no ResizeObserver loop occurs
  const padY = Math.ceil((h * swell) / 2) + 2;
  const padX = Math.ceil((px * 5 * swell * 1.3) / 2 + barge) + 4;

  const mvFor = (i) => {
    let mv = mvs.current[i];
    if (!mv) {
      mv = {
        x: motionValue(0),
        sx: motionValue(1),
        sy: motionValue(1)
      };
      mvs.current[i] = mv;
    }
    return mv;
  };

  const apply = (sel, instant) => {
    const C = cfg.current;
    const group = groupRef.current;
    const rtl = group ? getComputedStyle(group).direction === 'rtl' : false;
    const push = ((widths.current[sel] ?? 0) * C.swell) / 2 + C.barge;

    for (let i = 0; i < C.count; i++) {
      const mv = mvFor(i);
      const on = i === sel;
      const far = Math.abs(i - sel);
      const dir = Math.sign(i - sel) * (rtl ? -1 : 1);
      const x = dir * push;
      const s = on ? 1 + C.swell : 1 - C.shrink;

      // Stop previous in-flight springs for instant, glitch-free responsiveness
      anims.current[i]?.forEach?.((ctrl) => ctrl?.stop?.());
      anims.current[i] = [];

      if (instant || C.reduce) {
        mv.x.jump(x);
        mv.sx.jump(s);
        mv.sy.jump(s);
        continue;
      }

      const k = C.stiffness * (1 - 0.12 * Math.min(far, 3));
      const inFlight = mv.x.isAnimating() || mv.sx.isAnimating() || mv.sy.isAnimating();
      const delay = inFlight ? 0 : (far * C.stagger) / 1000;

      const a1 = animate(mv.x, x, { ...spring(k, 0.9, C.bounce), delay });

      const j = C.jelly;
      const a2 = animate(mv.sx, s, {
        ...spring(k * (1 + 0.24 * j), 0.9 - 0.1 * j, Math.min(0.85, C.bounce + 0.3 * j)),
        delay
      });
      const a3 = animate(mv.sy, s, {
        ...spring(k * (1 - 0.14 * j), 0.9 + 0.05 * j, C.bounce),
        delay: delay + 0.05 * j
      });

      anims.current[i] = [a1, a2, a3];
    }
  };

  const measureWidths = () => {
    if (!groupRef.current) return;
    widths.current = chipRefs.current.map((el) => el?.offsetWidth ?? 0);
  };

  const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

  useIsomorphicLayoutEffect(() => {
    const settle = () => {
      measureWidths();
      apply(applied.current, true);
    };

    settle();
    const rafId = requestAnimationFrame(settle);
    document.fonts?.ready?.then(settle);

    return () => cancelAnimationFrame(rafId);
  }, [itemsKey, size, gap, swell, barge, shrink]);

  useEffect(() => {
    if (applied.current === at) return;
    applied.current = at;
    apply(at, false);
  }, [at]);

  useEffect(() => {
    return () => {
      Object.values(anims.current).forEach((ctrls) => ctrls?.forEach?.((c) => c?.stop?.()));
      mvs.current.forEach((mv) => {
        mv?.x?.destroy();
        mv?.sx?.destroy();
        mv?.sy?.destroy();
      });
    };
  }, []);

  const commit = (i, instant) => {
    if (disabled || i === at || !list[i] || list[i].disabled) return;
    applied.current = i;
    apply(i, instant);
    if (value === undefined) setInner(list[i].value);
    onChange?.(list[i].value, i);
  };

  const stepFrom = (i, dir) => {
    const n = list.length;
    let j = i;
    for (let tries = 0; tries < n; tries++) {
      j = (j + dir + n) % n;
      if (!list[j].disabled) return j;
    }
    return i;
  };

  const onKeyDown = (e, i) => {
    let next = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = stepFrom(i, 1);
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = stepFrom(i, -1);
    else if (e.key === 'Home') next = stepFrom(-1, 1);
    else if (e.key === 'End') next = stepFrom(list.length, -1);
    else if (e.key === ' ' || e.key === 'Enter') next = i;
    if (next === null) return;
    e.preventDefault();
    commit(next, true);
    chipRefs.current[next]?.focus();
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={ariaLabel}
      data-disabled={disabled ? '' : undefined}
      className={`group inline-flex items-center select-none [-webkit-touch-callout:none] gap-[var(--jr-gap)] px-[var(--jr-pad-x)] py-[var(--jr-pad-y)] data-[disabled]:pointer-events-none data-[disabled]:opacity-50${className ? ` ${className}` : ''}`}
      style={{
        '--jr-chip': chipColor,
        '--jr-active': activeColor,
        '--jr-text': textColor,
        '--jr-active-text': activeTextColor,
        '--jr-gap': `${gap}px`,
        '--jr-radius': `${radius}px`,
        '--jr-h': `${h}px`,
        '--jr-font': `${font}px`,
        '--jr-px': `${px}px`,
        '--jr-pad-x': `${padX}px`,
        '--jr-pad-y': `${padY}px`
      }}
    >
      {list.map((it, i) => (
        <Chip
          key={it.value}
          mv={mvFor(i)}
          ref={(el) => {
            chipRefs.current[i] = el;
          }}
          type="button"
          role="radio"
          aria-checked={i === at}
          tabIndex={i === at ? 0 : -1}
          disabled={disabled || !!it.disabled}
          className="group/chip relative m-0 cursor-pointer touch-manipulation border-0 bg-transparent p-0 text-inherit outline-none [font:inherit] origin-center [-webkit-tap-highlight-color:transparent] data-[on=true]:cursor-default disabled:cursor-default disabled:opacity-40 group-data-[disabled]:disabled:opacity-100"
          data-on={i === at ? 'true' : 'false'}
          onClick={(e) => commit(i, e.detail === 0)}
          onKeyDown={(e) => onKeyDown(e, i)}
        >
          <span className="relative inline-flex items-center justify-center gap-[0.4em] overflow-hidden rounded-[var(--jr-radius)] bg-[var(--jr-chip)] leading-none font-semibold whitespace-nowrap [color:var(--jr-text)] [height:var(--jr-h)] [padding:0_var(--jr-px)] [font-size:var(--jr-font)] [transition:background-color_180ms_ease,color_180ms_ease,box-shadow_180ms_ease] group-data-[on=true]/chip:bg-[var(--jr-active)] group-data-[on=true]/chip:[color:var(--jr-active-text)] group-data-[on=true]/chip:shadow-[0_2px_8px_rgba(26,115,232,0.35)] before:pointer-events-none before:absolute before:inset-0 before:bg-current before:opacity-0 before:[transition:opacity_150ms_ease] before:content-[''] [@media(hover:hover)_and_(pointer:fine)]:group-hover/chip:group-enabled/chip:group-data-[on=false]/chip:before:opacity-[0.08]">
            {it.icon ? <span className="inline-flex shrink-0 items-center justify-center">{it.icon}</span> : null}
            <span className="jelly-radio__label">{it.label}</span>
          </span>
        </Chip>
      ))}
    </div>
  );
}
