export async function fetchEvents({signal, searchTerm}) {
  let URL = 'http://localhost:3000/events'

  if (searchTerm) {
    URL += '?search=' + searchTerm
  }

  const response = await fetch(URL, signal);

  if (!response.ok) {
    const error = new Error('An error occurred while fetching the events');
    error.code = response.status;
    error.info = await response.json();
    throw error;
  }

  const { events } = await response.json();

  return events;
}