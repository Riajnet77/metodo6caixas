# Operação comercial — Método 6 Caixas

## Implementado

- Recuperação de senha por email via HTTPS (Resend).
- Limite de solicitações por IP e por conta: intervalo de um minuto e até três emails de recuperação por hora por conta.
- Link individual com 30 minutos de validade, token aleatório de 256 bits; apenas o hash fica no MongoDB.
- Uso único por operação atômica e versão da conta: trocar a senha invalida todos os links anteriores e sessões daquela conta.
- Cadastro público fechado no servidor. O código fixo do navegador foi removido.
- Compras de pagamento único pela Hotmart: verificar Hottok e lista de IDs dos produtos permitidos; criar a conta somente em compra aprovada/completa.
- Reembolso integral, chargeback e cancelamento revogam a transação. Uma segunda compra válida mantém acesso.
- Eventos duplicados não criam contas novamente. Eventos de aprovação, mesmo posteriores, não reativam uma transação já revogada.
- APIs protegidas conferem conta ativa, versão da sessão e direito de acesso no MongoDB em cada chamada.
- Contas anteriores ficam preservadas. A primeira compra aprovada migra a conta para controle pela Hotmart. Contas com `access_mode: manual` mantêm concessão manual, respeitando `is_active`.
- Mensagens de senha incorreta, indisponibilidade e acesso suspenso são distintas. Falha temporária ao consultar a sessão conserva o token e oferece nova tentativa.
- Checkout e suporte são configurados no backend; o frontend recebe somente informações públicas. Nenhuma credencial vai ao navegador.

## Ativação no Render

Serviço: `metodo6caixas-api`. Abra Environment; adicione os valores privados abaixo. Não coloque chaves no GitHub nem em conversas públicas.

| Variável | Valor |
| --- | --- |
| `SECRET_KEY` | Chave aleatória longa de assinatura; provisionada separadamente no Render. Alterá-la exige novo login em todas as contas. |
| `APP_URL` | `https://www.metodo6caixas.com.br` |
| `SUPPORT_EMAIL` | Email real de atendimento |
| `RESEND_API_KEY` | Chave de envio criada em uma conta Resend |
| `EMAIL_FROM` | Nome e email remetente em um domínio verificado no Resend |
| `HOTMART_HOTTOK` | Token da aba de autenticação dos webhooks da conta Hotmart |
| `HOTMART_PRODUCT_IDS` | ID numérico do produto vendido; mais de um ID separado por vírgula, se necessário |
| `HOTMART_CHECKOUT_URL` | Link HTTPS real do checkout Hotmart |

O Resend requer configuração/verificação do domínio e limites de envio adequados. Usar um remetente de exemplo não libera email para todos os compradores. As portas SMTP são bloqueadas no Render gratuito; esta integração usa HTTPS.

Enquanto as credenciais de email estiverem ausentes, a recuperação informa indisponibilidade e encaminha ao suporte. Não retorna uma confirmação fictícia de envio. Sem Hottok e produto configurados, o webhook responde 503 e não concede acesso.

## Configuração na Hotmart

Na ferramenta Webhook/API e notificações, selecione o produto correto, versão `2.0.0`, URL:

`https://metodo6caixas-api.onrender.com/api/integrations/hotmart/webhook`

Eventos suportados:

- `PURCHASE_APPROVED`
- `PURCHASE_COMPLETE`
- `PURCHASE_REFUNDED`
- `PURCHASE_CHARGEBACK`
- `PURCHASE_CANCELED`

A conta só é liberada após o recebimento de uma notificação autenticada. A entrega depende de o email informado na compra estar correto. O comprador define a senha pelo link, sem receber uma senha em texto. Se o link vencer, `/esqueci-senha` permite solicitar outro.

Notificação com falha de email responde 503; reenvio retoma o envio sem duplicar a conta. A Hotmart deve estar com suas notificações e retentativas funcionando. A página `/register` agora explica o primeiro acesso e não cria conta sem compra.

Esta implementação é para **pagamento único**. Assinaturas, cancelamento ao fim do período pago, atraso, renovação, reembolso parcial e múltiplos níveis de produto precisam de políticas próprias antes de serem oferecidos. Uma transação revogada é terminal; restauração é por nova compra válida ou concessão manual auditada.

## Homologação antes de abrir vendas

1. Verificar o remetente no Resend e o destino dos emails reais (caixa de entrada e spam).
2. Confirmar que o botão da landing abre o checkout correto e que seus preços/garantias correspondem à oferta.
3. Executar compra de homologação e conferir email, definição de senha, login e diagnóstico.
4. Conferir nova solicitação de senha, expiração, uso único e invalidação de sessões.
5. Conferir reembolso/chargeback, inclusive em um navegador já autenticado.
6. Conferir as notificações de falha e retentativas no painel da Hotmart.

A compilação e testes locais não substituem esta homologação com as credenciais reais. Os testes usam banco simulado e remetente simulado, sem mandar emails a clientes ou alterar contas de produção.

O Render Free pode desligar após 15 minutos sem tráfego e levar aproximadamente um minuto para iniciar. A interface tolera a espera e diferencia indisponibilidade de senha errada, mas isso não garante disponibilidade comercial. Não há mudança automática para plano pago. `/api/health` fornece uma checagem simples de processo, não uma garantia de conexão ao banco.

## Referências

- Hotmart: https://help.hotmart.com/pt-br/article/215827858/como-integro-a-minha-area-de-membros-externa-com-a-hotmart-
- Webhook Hotmart: https://developers.hotmart.com/docs/pt-BR/2.0.0/webhook/purchase-webhook/
- Resend: https://resend.com/docs/api-reference/emails/send-email
- Render Free: https://render.com/docs/free
