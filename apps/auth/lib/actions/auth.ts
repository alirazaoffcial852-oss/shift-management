"use server";

export async function login(email: string, password: string) {
  const formdata = new FormData();
  formdata.append("email", email);
  formdata.append("password", password);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/auth/login`,
    {
      method: "POST",
      body: formdata,
    }
  );
  let resp = await response.json();

  return {
    data: { ...resp },
    status: response.status,
    statusText: response.statusText,
  };
}
