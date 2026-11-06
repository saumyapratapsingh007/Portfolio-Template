import { CARDS } from './scene4/layout4.js';
import { YEARS } from './scene3/layout3.js';

// Flow-based cards remain available on phones, even without WebGL.
const projects = document.createElement('div');
projects.className = 'mobile-projects';
projects.innerHTML = '<h2>Creative work</h2><div class="mobile-projects__grid"></div>';
CARDS.forEach((card, i) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'mobile-project g-card';
  button.dataset.i = String(i);
  const image = document.createElement('img');
  image.src = `public/disciplines/category-${i + 1}.jpg`;
  image.alt = '';
  image.loading = 'lazy';
  const title = document.createElement('span');
  title.textContent = card.title;
  button.append(image, title);
  projects.querySelector('.mobile-projects__grid').append(button);
});
document.querySelector('.gallery__pin').append(projects);

const journey = document.createElement('div');
journey.className = 'mobile-journey';
journey.innerHTML = '<h2>My creative journey</h2><ol></ol>';
YEARS.forEach(year => {
  const item = document.createElement('li');
  const image = document.createElement('img');
  image.src = year.image;
  image.alt = '';
  image.loading = 'lazy';
  const title = document.createElement('h3');
  title.textContent = `${year.year} / ${year.key}`;
  const detail = document.createElement('p');
  detail.textContent = year.lines.join(' · ');
  item.append(image, title, detail);
  journey.querySelector('ol').append(item);
});
document.querySelector('.chrono__pin').append(journey);
