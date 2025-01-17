async function sendDelete(url, filename) {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({
        name: filename,
      }),
    });
  
    if (response.ok) {
      alert('Cake deleted successfully.');
      location.reload();
    } else {
      alert('Failed to delete cake.');
    }
  }
  