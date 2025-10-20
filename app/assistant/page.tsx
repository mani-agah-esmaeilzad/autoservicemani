import AiAssistant from '@/components/AiAssistant';
import { listAiSessions } from '@/lib/data';

export const metadata = {
  title: 'دستیار فنی هوشمند | Mani Oil',
  description:
    'چت هوشمند برای دریافت پاسخ تخصصی درباره انتخاب روغن، فیلتر و نگهداری خودرو در مانی اویل.'
};

export default async function AssistantPage() {
  const sessions = await listAiSessions();

  return (
    <div className="section" style={{ paddingTop: '2rem' }}>
      <div className="container ai-assistant-container">
        <AiAssistant initialSessions={sessions} />
      </div>
    </div>
  );
}
