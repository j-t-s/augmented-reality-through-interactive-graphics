
public class EdgeData {
	int height;
	int width;
	short[] dataX;
	short[] dataY;
	
	EdgeData(int width, int height){
		this.height = height - 2;
		this.width = width - 2;
		dataX = new short[this.height*this.width];
		dataY = new short[this.height*this.width];
	}
}