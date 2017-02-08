package errbuddy

/**
 * marker interface (could also be a abstract class but we want a static final list so fuck that)
 * implementing classes must have a "static filterFields" field (list of strings)
 */
public interface IsFilterable {

}