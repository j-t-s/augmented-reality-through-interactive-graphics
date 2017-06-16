import java.util.HashMap;

public class EdgeFilterHolder {

	private EdgeFilterHolder() {}
	
	
	private static HashMap<Integer, EdgeFilter> EdgeFilterStore = new HashMap<>();
	/*
	static{
		EdgeFilterStore = new HashMap<>();
	}*/
	
	public static EdgeFilter getEdgeFilter(int w, int h){//TODO make an exception occur if the parameters are two big or negative.
		//If any of first 16 MSB are in use, return null
		if (((w | h) & 0xffff0000) == 0){
			Integer key = (h << 16) + w;
			if (EdgeFilterStore.containsKey(key))
				return EdgeFilterStore.get(key);
			else{
				EdgeFilter out = new EdgeFilter(w, h);
				EdgeFilterStore.put(key, out);
				return out;
			}
		}
		return null;
	}

}
