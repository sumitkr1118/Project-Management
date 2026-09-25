import TodayUpdateForm from '../components/dailyUpdate/TodayUpdateForm'
import UpdateHistoryList from '../components/dailyUpdate/UpdateHistoryList'

export default function MyDailyUpdates() {
  return (
    <div>
      <div className="page-title mb-6">My Daily Updates</div>
      <div className="mb-6">
        <TodayUpdateForm />
      </div>
      <UpdateHistoryList />
    </div>
  )
}
