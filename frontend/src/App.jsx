import { useState, useEffect } from "react";
import { getUsers, createUser, updateUser, deleteUser } from "./api";
export default function App() {
    //	---	ÉTATS	(state)	--
    const [users, setUsers] = useState([]); //	la	liste	des	utilisateurs
    const [form, setForm] = useState({ nom: "", prenom: "", email: "" });
    const [editId, setEditId] = useState(null); //	null	=	mode	ajout	;	sinon	=	modification
    const [error, setError] = useState("");
    //	---	CHARGEMENT	INITIAL	--
    //	useEffect	avec	[]	:	s'exécute	une	seule	fois,	au	montage	du	composant.
    useEffect(() => {
        refresh();
    }, []);
    async function refresh() {
        try {
            setUsers(await getUsers());
        } catch (e) {
            setError(e.message);
        }
    }
    //	Met	à	jour	le	formulaire	quand	on	tape	dans	un	champ.
    function handleChange(e) {
        setForm({ ...form, [e.target.name]: e.target.value });
    }
    //	Soumission	:	crée	OU	met	à	jour	selon	editId.
    async function handleSubmit() {
        setError("");
        try {
            if (editId === null) {
                await createUser(form);
            } else {
                await updateUser(editId, form);
                setEditId(null);
            }
            setForm({ nom: "", prenom: "", email: "" }); //	vide	le	formulaire
            refresh();
        } catch (e) {
            setError(e.message);
        }
    }
    //	Pré-remplit	le	formulaire	pour	modifier	un	utilisateur.
    function startEdit(user) {
        setEditId(user.id);
        setForm({ nom: user.nom, prenom: user.prenom, email: user.email });
    }
    //	Supprime	après	confirmation.
    async function handleDelete(id) {
        if (!confirm("Supprimer	cet	utilisateur	?")) return;
        try {
            await deleteUser(id);
            refresh();
        } catch (e) {
            setError(e.message);
        }
    }
    //	---	AFFICHAGE	(JSX)	--
    return (
        <div className="container">
            <h1>Gestion des utilisateurs</h1>
            {error && <p className="error">{error}</p>}
            <div className="card">
                <h2>
                    {editId === null ? "Ajouter" : "Modifier"} un utilisateur
                </h2>
                <input
                    name="nom"
                    placeholder="Nom"
                    value={form.nom}
                    onChange={handleChange}
                />
                <input
                    name="prenom"
                    placeholder="Prénom"
                    value={form.prenom}
                    onChange={handleChange}
                />
                <input
                    name="email"
                    placeholder="Email"
                    value={form.email}
                    onChange={handleChange}
                />
                <button onClick={handleSubmit}>
                    {editId === null ? "Ajouter" : "Enregistrer"}
                </button>
                {editId !== null && (
                    <button
                        className="ghost"
                        onClick={() => {
                            setEditId(null);
                            setForm({ nom: "", prenom: "", email: "" });
                        }}
                    >
                        Annuler
                    </button>
                )}
            </div>
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Nom</th>
                        <th>Prénom</th>
                        <th>Email</th>
                        <th>Créé le</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((u) => (
                        <tr key={u.id}>
                            <td>{u.id}</td>
                            <td>{u.nom}</td>
                            <td>{u.prenom}</td>
                            <td>{u.email}</td>
                            <td>
                                {new Date(u.date_creation).toLocaleString(
                                    "fr-FR",
                                )}
                            </td>
                            <td>
                                <button onClick={() => startEdit(u)}>
                                    Modifier
                                </button>
                                <button
                                    className="danger"
                                    onClick={() => handleDelete(u.id)}
                                >
                                    Supprimer
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
