export const ini = (n) =>
  (n || '?')
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

export const avColors = [
  ['#E1F5EE', '#0F6E56'],
  ['#E6F1FB', '#185FA5'],
  ['#EEEDFE', '#534AB7'],
  ['#FAEEDA', '#854F0B'],
  ['#FBEAF0', '#993556'],
];

export const av = (i) => avColors[i % avColors.length];


// 🔁 Replaces gradeBadge → priorityBadge
export const priorityBadge = (p) => {
  if (!p) return 'bgy';
  if (p === 'High') return 'br';     // red
  if (p === 'Medium') return 'ba';   // amber
  if (p === 'Low') return 'bg';      // green
  return 'bgy';
};


// 🔁 Updated statusBadge for tasks
export const statusBadge = (s) => {
  if (!s) return 'bgy';
  if (s === 'Todo' || s === 'Pending') return 'bgy';
  if (s === 'In Progress') return 'bt';
  if (s === 'Completed') return 'bg';
  if (s === 'Overdue') return 'br';
  return 'ba';
};


// 🔁 Replaces calcAvgGrade → calcTaskProgress
export const calcTaskProgress = (tasks) => {
  if (!tasks.length) return '—';

  const completed = tasks.filter((t) => t.status === 'Completed').length;
  const percent = completed / tasks.length;

  if (percent === 1) return 'Done';
  if (percent >= 0.75) return 'Almost Done';
  if (percent >= 0.5) return 'In Progress';
  if (percent > 0) return 'Started';
  return '—';
};


// 🔒 Password strength (unchanged)
export const pwStrength = (pw) => {
  if (!pw)
    return { width: '0%', color: '#E5E3DC', label: 'Enter a password' };
  if (pw.length < 6)
    return { width: '25%', color: '#E57373', label: 'Too short' };
  if (pw.length < 8)
    return { width: '50%', color: '#FFB74D', label: 'Fair' };
  if (/[A-Z]/.test(pw) && /[0-9]/.test(pw))
    return { width: '75%', color: '#1D9E75', label: 'Good' };
  return { width: '100%', color: '#4CAF50', label: 'Strong' };
 
};