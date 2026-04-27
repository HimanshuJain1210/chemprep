// SM-2 spaced repetition (simplified, proven in Anki)
// grade: 0 Again, 3 Hard, 4 Good, 5 Easy
export function grade(card, q){
  let { ease = 2.5, reps = 0, interval = 0 } = card;
  if (q < 3){
    reps = 0;
    interval = 1;
  } else {
    if (reps === 0) interval = 1;
    else if (reps === 1) interval = 6;
    else interval = Math.round(interval * ease);
    reps += 1;
    ease = Math.max(1.3, ease + (0.1 - (5 - q) * (0.08 + (5 - q) * 0.02)));
  }
  const next = Date.now() + interval * 86400000;
  return { ...card, ease, reps, interval, next };
}

export function dueNow(cards){
  const now = Date.now();
  return cards.filter(c => (c.next || 0) <= now);
}
