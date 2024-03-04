import { getActions } from "~/services/actions";

export default function HomePage() {
  const actions = getActions();

  return (
    <main>
      {actions.map((action) => (
        <p key={action.hrid}>{action.name}</p>
      ))}
    </main>
  );
}
