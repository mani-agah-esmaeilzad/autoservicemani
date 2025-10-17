import AiAssistant from '@/components/AiAssistant';
// import { listAiSessions } from '@/lib/data';

export const metadata = {
  title: 'دستیار فنی هوشمند | Auto Service Mani',
  description:
    'چت هوشمند برای دریافت پاسخ تخصصی درباره نگهداری خودرو، انتخاب روغن و عیب‌یابی فنی در اتو سرویس مانی.'
};

export default async function AssistantPage() {
   const { listAiSessions } = await import("@/lib/data");
  const sessions = await listAiSessions();

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container ai-assistant-container">
        <AiAssistant initialSessions={sessions} />
      </div>
    </div>
  );
}
