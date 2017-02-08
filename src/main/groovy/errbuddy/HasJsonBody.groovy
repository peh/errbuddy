package errbuddy

/**
 * Interfaced used for Objects being send out over the API
 * A global converter is registered once for all implementing classes in Bootstrap.groovy
 */
interface HasJsonBody {
	public Map getJsonBody()
}
