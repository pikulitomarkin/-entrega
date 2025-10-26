import { useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { QRCodeSVG } from 'qrcode.react';
import { getFunctions, httpsCallable } from 'firebase/functions';
import toast from 'react-hot-toast';

export default function WhatsAppConnectPage() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    const unsubQr = onSnapshot(
      doc(db, 'whatsapp-status', 'qr'),
      (doc) => {
        if (doc.exists()) {
          setQrCode(doc.data().qr);
        }
      },
      (error) => {
        console.debug('WhatsApp QR snapshot error (expected during development):', error);
      }
    );

    const unsubStatus = onSnapshot(
      doc(db, 'whatsapp-status', 'status'),
      (doc) => {
        if (doc.exists()) {
          setStatus(doc.data().status);
        }
      },
      (error) => {
        console.debug('WhatsApp status snapshot error (expected during development):', error);
      }
    );

    return () => {
      unsubQr();
      unsubStatus();
    };
  }, []);

  const handleConnect = async () => {
    setIsConnecting(true);
    const functions = getFunctions();
    const startWhatsappBot = httpsCallable(functions, 'startWhatsappBot');
    try {
      await startWhatsappBot();
      toast.success('Conexão iniciada! Verifique o código QR.');
    } catch (error: any) {
      console.error("Error starting bot", error);
      toast.error('Função de WhatsApp não disponível. Verifique se o backend está ativo.');
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Conectar WhatsApp</h1>
        <p className="text-gray-600">Integre o WhatsApp para receber pedidos via mensagem</p>
      </div>
      <div className="bg-white p-8 rounded-2xl shadow-md border border-red-100">
        {status === 'ready' ? (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <p className="text-green-700 font-bold text-lg">Cliente WhatsApp pronto!</p>
            <p className="text-green-600 text-sm mt-2">Você pode receber pedidos via WhatsApp</p>
          </div>
        ) : qrCode ? (
          <div className="flex flex-col items-center justify-center py-8">
            <p className="mb-6 text-gray-600 text-center">Escaneie o código QR com seu celular para conectar:</p>
            <div className="p-4 bg-red-50 rounded-lg border border-red-100">
              <QRCodeSVG value={qrCode} size={256} />
            </div>
            <p className="text-sm text-gray-500 mt-6 text-center">O código expira em 1 minuto. Abra o WhatsApp no seu celular e aponte a câmera para o código.</p>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 rounded-lg bg-red-50 flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-red-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <p className="text-gray-700 font-semibold mb-4 text-center">Conectar ao WhatsApp</p>
            <button
              onClick={handleConnect}
              disabled={isConnecting}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-bold py-3 px-8 rounded-lg transition-colors shadow-md"
            >
              {isConnecting ? 'Conectando...' : 'Iniciar Conexão'}
            </button>
            <p className="text-sm text-gray-500 mt-4 text-center">Você será redirecionado para escanear um código QR</p>
          </div>
        )}
      </div>
    </div>
  );
}
