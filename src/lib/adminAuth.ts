/**
 * Client-side helper to verify if the currently authenticated user
 * has administrator privileges by asking the secure server-side endpoint.
 * 
 * No admin emails or passwords are ever contained in client bundles.
 */
export async function verifyAdminStatus(token: string): Promise<boolean> {
  if (!token) return false;
  try {
    const res = await fetch('/api/admin/verify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.isAdmin);
  } catch {
    return false;
  }
}

