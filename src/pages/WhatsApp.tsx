import { MessageCircle, QrCode, CheckCircle2, Zap, Bot, MessageSquare, Users } from 'lucide-react';

export default function WhatsApp() {
  const isConnected = false; // TODO: Implementar lógica de conexão

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-dark-900 mb-2">WhatsApp</h1>
        <p className="text-dark-700">Integração com WhatsApp Web e IA</p>
      </div>

      {/* Connection Status */}
      <div className="bg-dark-500 rounded-lg border border-dark-300 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-lg flex items-center justify-center ${
              isConnected
                ? 'bg-green-100'
                : 'bg-yellow-100'
            }`}>
              <MessageCircle className={`w-7 h-7 ${
                isConnected ? 'text-green-600' : 'text-yellow-600'
              }`} />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-dark-900 mb-1">
                Status da Conexão
              </h3>
              <p className={`text-sm ${
                isConnected ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {isConnected ? 'Conectado' : 'Desconectado'}
              </p>
            </div>
          </div>

          {!isConnected && (
            <button className="flex items-center gap-2 bg-green-600 text-white px-5 py-2.5 rounded-lg hover:bg-green-700 transition-colors font-medium">
              <QrCode className="w-5 h-5" />
              Conectar WhatsApp
            </button>
          )}
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={Bot}
          title="IA Inteligente"
          description="Sistema de IA identifica pedidos automaticamente nas mensagens"
          color="text-purple-600"
          bgColor="bg-purple-100"
        />
        <FeatureCard
          icon={Zap}
          title="Processamento Rápido"
          description="Pedidos são cadastrados em segundos após o recebimento"
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <FeatureCard
          icon={MessageSquare}
          title="Respostas Automáticas"
          description="Envie confirmações e atualizações automaticamente"
          color="text-green-600"
          bgColor="bg-green-100"
        />
      </div>

      {/* Setup Instructions */}
      <div className="bg-dark-500 rounded-lg border border-dark-300 overflow-hidden">
        <div className="p-6 border-b border-dark-300">
          <h3 className="text-lg font-semibold text-dark-900">Como Configurar</h3>
        </div>

        <div className="p-6">
          <div className="space-y-6">
            <Step
              number={1}
              title="Backend Node.js"
              description="Configure o servidor backend com whatsapp-web.js"
              status="pending"
            />
            <Step
              number={2}
              title="Escanear QR Code"
              description="Use seu celular para escanear o QR Code e autenticar"
              status="pending"
            />
            <Step
              number={3}
              title="Configurar IA"
              description="Integre com OpenAI API para processamento automático"
              status="pending"
            />
            <Step
              number={4}
              title="Testar Integração"
              description="Envie uma mensagem de teste e verifique o cadastro automático"
              status="pending"
            />
          </div>

          <div className="mt-6 p-4 bg-blue-100 border border-blue-300 rounded-lg">
            <div className="flex gap-3">
              <div className="flex-shrink-0">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div>
                <p className="text-sm font-medium text-dark-900 mb-1">
                  Requer Backend Separado
                </p>
                <p className="text-sm text-dark-700">
                  A integração com WhatsApp requer um servidor Node.js separado.
                  Consulte a documentação no arquivo PROJECT_SETUP.md para instruções detalhadas.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Message Templates */}
      <div className="bg-dark-500 rounded-lg border border-dark-300 overflow-hidden">
        <div className="p-6 border-b border-dark-300">
          <h3 className="text-lg font-semibold text-dark-900">Templates de Mensagens</h3>
        </div>

        <div className="divide-y divide-dark-300">
          <MessageTemplate
            title="Confirmação de Pedido"
            message="Olá! Seu pedido foi recebido e está sendo preparado. Número do pedido: #{{order_id}}"
          />
          <MessageTemplate
            title="Pedido Pronto"
            message="Seu pedido #{{order_id}} está pronto! O entregador sairá em breve."
          />
          <MessageTemplate
            title="Saiu para Entrega"
            message="Seu pedido #{{order_id}} saiu para entrega! Previsão: {{delivery_time}} minutos."
          />
        </div>
      </div>

      {/* Stats */}
      {isConnected && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard
            icon={MessageSquare}
            label="Mensagens Hoje"
            value="0"
            color="text-blue-600"
            bgColor="bg-blue-100"
          />
          <StatCard
            icon={CheckCircle2}
            label="Pedidos Processados"
            value="0"
            color="text-green-600"
            bgColor="bg-green-100"
          />
          <StatCard
            icon={Users}
            label="Clientes Ativos"
            value="0"
            color="text-purple-600"
            bgColor="bg-purple-100"
          />
        </div>
      )}
    </div>
  );
}

function FeatureCard({ icon: Icon, title, description, color, bgColor }: any) {
  return (
    <div className="bg-dark-500 rounded-lg border border-dark-300 p-6">
      <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center mb-4`}>
        <Icon className={`w-6 h-6 ${color}`} />
      </div>
      <h4 className="font-semibold text-dark-900 mb-2">{title}</h4>
      <p className="text-sm text-dark-700">{description}</p>
    </div>
  );
}

function Step({ number, title, description, status }: any) {
  return (
    <div className="flex gap-4">
      <div className="flex-shrink-0">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
          status === 'completed'
            ? 'bg-green-600 text-white'
            : 'bg-dark-400 text-dark-600'
        }`}>
          {status === 'completed' ? <CheckCircle2 className="w-5 h-5" /> : number}
        </div>
      </div>
      <div className="flex-1 pt-1">
        <h4 className="font-medium text-dark-900 mb-1">{title}</h4>
        <p className="text-sm text-dark-700">{description}</p>
      </div>
    </div>
  );
}

function MessageTemplate({ title, message }: any) {
  return (
    <div className="p-6 hover:bg-dark-400 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <h4 className="font-medium text-dark-900">{title}</h4>
        <button className="text-xs bg-dark-400 text-dark-900 px-3 py-1.5 rounded-lg hover:bg-dark-300 transition-colors">
          Editar
        </button>
      </div>
      <p className="text-sm text-dark-700 font-mono bg-dark-400 p-3 rounded-lg">
        {message}
      </p>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, color, bgColor }: any) {
  return (
    <div className="bg-dark-500 rounded-lg border border-dark-300 p-6">
      <div className="flex items-center gap-4 mb-4">
        <div className={`w-12 h-12 rounded-lg ${bgColor} flex items-center justify-center`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
        <div className="flex-1">
          <p className="text-sm text-dark-700">{label}</p>
          <p className="text-2xl font-bold text-dark-900">{value}</p>
        </div>
      </div>
    </div>
  );
}
