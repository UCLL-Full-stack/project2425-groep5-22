const getAll = async () => {
  return await fetch(`${process.env.NEXT_PUBLIC_API_URL}/intensities`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
  });
}

export default {
  getAll
}