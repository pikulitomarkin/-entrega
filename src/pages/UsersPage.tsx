import { useEffect } from 'react';
import { useUserStore } from '../store/userStore';

export default function UsersPage() {
  const users = useUserStore(state => state.users);
  const subscribeToUsers = useUserStore(state => state.subscribeToUsers);
  const approveUser = useUserStore(state => state.approveUser);
  const rejectUser = useUserStore(state => state.rejectUser);

  useEffect(() => {
    const unsubscribe = subscribeToUsers();
    return () => {
      try {
        unsubscribe();
      } catch (error) {
        console.debug('Error unsubscribing from users:', error);
      }
    };
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Gerenciar Usuários</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Nome</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Email</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Função</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">Status</th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {users && users.length > 0 ? (
              users.map(user => (
                <tr key={user.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.name || user.username || 'N/A'}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.email || 'N/A'}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.role || 'N/A'}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">{user.status || 'ativo'}</td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                    {user.role === 'deliverer' && user.status === 'pending' && (
                      <>
                        <button onClick={() => approveUser(user.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2">Aprovar</button>
                        <button onClick={() => rejectUser(user.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">Rejeitar</button>
                      </>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center text-gray-500">
                  Nenhum usuário encontrado
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
