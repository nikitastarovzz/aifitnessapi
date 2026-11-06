// Fixture for scripts/deprecation-scan.test.mjs: one Google Fit or Samsung rule per marked line.
import com.samsung.android.sdk.healthdata.HealthDataStore

class FitReader {
    fun history() = Fitness.getHistoryClient(this, GoogleSignIn.getAccountForExtension(this, fitnessOptions))
    fun sessions() = Fitness.getSessionsClient(this, googleSigninAccount)
    fun recording() = Fitness.getRecordingClient(this, account)
    fun sensors() = Fitness.getSensorsClient(this, account)
    fun goals() = Fitness.getGoalsClient(requireContext(), getGoogleAccount())
    fun healthConnect() = HealthConnectClient.getOrCreate(context)
}
