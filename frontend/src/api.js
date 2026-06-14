//	URL	de	base	de	l'API.	Lue	depuis	une	variable	d'environnement	Vite,
//	avec	une	valeur	par	défaut	pour	le	développement	local.
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";
//	READ	:	récupérer	tous	les	utilisateurs
export async function getUsers() {
    const res = await fetch(`${API_URL}/users`);
    if (!res.ok) {
        throw new Error("Erreur	lors	du	chargement");
    }
    return res.json();
}
//	CREATE	:	ajouter	un	utilisateur
export async function createUser(user) {
    const res = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!res.ok) {
        throw new Error((await res.json()).detail || "Erreur");
    }
    return res.json();
}
//	UPDATE	:	modifier	un	utilisateur
export async function updateUser(id, user) {
    const res = await fetch(`${API_URL}/users/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!res.ok) {
        throw new Error((await res.json()).detail || "Erreur");
    }
    return res.json();
}
//	DELETE	:	supprimer	un	utilisateur
export async function deleteUser(id) {
    const res = await fetch(`${API_URL}/users/${id}`, { method: "DELETE" });
    if (!res.ok) {
        throw new Error("Erreur	lors	de	la	suppression");
    }
}
