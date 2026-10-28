import { Page, Locator } from '@playwright/test';

interface Strategy {
  name: string;
  selector: string;
  priority: number;
}

export class SelfHealingLocator {
  private strategies: Strategy[];

  constructor(private page: Page, strategies: Strategy[]) {
    this.strategies = [...strategies].sort((a, b) => a.priority - b.priority);
  }

  async find(timeout = 5000): Promise<Locator> {
    for (const s of this.strategies) {
      try {
        const loc = this.page.locator(s.selector);
        await loc.waitFor({ state: 'visible', timeout });

        if (s.priority > 1) {
          console.warn(`[SelfHealing] Fell back to: ${s.name}`);
        }

        return loc;
      } catch {
        /* try next */
      }
    }

    throw new Error('[SelfHealing] All strategies failed');
  }
}

/*
Usage in a Page Object:

private emailInput = new SelfHealingLocator(this.page, [
  { name: 'aria-label', selector: '[aria-label="Email"]', priority: 1 },
  { name: 'testId', selector: '[data-testid="email"]', priority: 2 },
  { name: 'placeholder', selector: 'input[placeholder*="mail"]', priority: 3 },
]);
*/