export async function getData(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
    const data = await res.json();
    return { data, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function postForm(url, data) {
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!res.ok) {
      throw new Error(`HTTP error! Status: ${res.status}`);
    }

    const result = await res.json();
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}

export async function update(url, key, keyValue) {
  try {
    const res = await fetch(url, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        [key]: keyValue,
      }),
    });
    if (!res.ok) {
      throw new Error("Failed to update password");
    }
    const result = await res.json();
    return { data: result, error: null };
  } catch (error) {
    return { data: null, error: error.message };
  }
}
