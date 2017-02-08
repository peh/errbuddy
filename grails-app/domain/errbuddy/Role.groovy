package errbuddy

class Role implements HasJsonBody {

	String authority

	static constraints = {
		authority blank: false, unique: true
	}

	@Override
	Map getJsonBody() {
		[role: authority]
	}
}
