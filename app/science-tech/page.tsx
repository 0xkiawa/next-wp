// app/science-tech/page.tsx

import Books from '@/app/science-tech/sections/bookcolumn';

import { Section, Container } from '@/components/craft';

export default function BooksAndCulturePage() {
  return (
    <Section>
      <Container>
        <Books />
      </Container>
    </Section>
  );
}
