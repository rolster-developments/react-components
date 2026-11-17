import { coincidence } from '@rolster/strings';

interface Describable {
  description: string;
}

export function filterByPattern<E extends Describable>(
  elements: E[],
  pattern: string
): E[] {
  return pattern
    ? elements.filter((element) =>
        coincidence(element.description, pattern, true)
      )
    : elements;
}
