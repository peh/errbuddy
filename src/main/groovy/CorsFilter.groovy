import org.springframework.web.filter.OncePerRequestFilter

import javax.annotation.Priority
import javax.servlet.FilterChain
import javax.servlet.ServletException
import javax.servlet.http.HttpServletRequest
import javax.servlet.http.HttpServletResponse

@Priority(Integer.MIN_VALUE)
class CorsFilter extends OncePerRequestFilter {

	CorsFilter() {}

	@Override
	protected void doFilterInternal(HttpServletRequest req, HttpServletResponse resp, FilterChain chain)
		throws ServletException, IOException {

		String origin = req.getHeader("Origin")

		boolean options = req.method.equalsIgnoreCase("OPTIONS")
		if (options) {
			if (origin == null) return
			resp.addHeader("Access-Control-Allow-Headers", "key, origin, authorization, accept, content-type, x-requested-with")
			resp.addHeader("Access-Control-Allow-Methods", "GET, HEAD, POST, PUT, DELETE, TRACE, OPTIONS")
			resp.addHeader("Access-Control-Max-Age", "3600")
		}

		resp.addHeader("Access-Control-Allow-Origin", origin == null ? "*" : origin)
		resp.addHeader("Access-Control-Allow-Credentials", "true")

		if (!options) chain.doFilter(req, resp)
	}
}
