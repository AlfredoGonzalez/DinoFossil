import { DINO_FACTS } from '@/data/dinoFacts';
import { DINOS } from '@/data/dinos';
import { DINO_FACT_TEXTS } from '@/i18n/dinoFacts';

describe('fichas de dinos', () => {
  it('cada especie tiene datos y textos en los dos idiomas', () => {
    for (const d of DINOS) {
      expect(DINO_FACTS[d.id]).toBeDefined();
      expect(DINO_FACT_TEXTS.es[d.id]?.fact).toBeTruthy();
      expect(DINO_FACT_TEXTS.en[d.id]?.region).toBeTruthy();
    }
  });
});
