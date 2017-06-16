import java.awt.Point;
import java.awt.image.BufferedImage;
import java.awt.image.DataBufferByte;

public class EdgeFilter {
	private BufferedImage imgBufferGray;
	private BufferedImage originalBufferedImage;
	private EdgeData edgeDataBuffer;
	private Point winPos = new Point();//The position of the window of the filter, upper left corner.
	
	EdgeFilter(int w, int h){
		if (h < 3 || w < 3){
			System.err.println("Image to small: cannot run Edge Filter.");
			return;
		}
		//Initialize the grayscale buffer
		imgBufferGray = new BufferedImage(w, h, BufferedImage.TYPE_BYTE_GRAY);
		edgeDataBuffer = new EdgeData(w, h);
	}
	
	public EdgeData getEdgeData(BufferedImage bi, int x, int y){
		originalBufferedImage = bi;
		winPos.x = x;
		winPos.y = y;
		grayscale();
		return sobel();
	}

	private void grayscale(){
		byte[] inPixels = ((DataBufferByte) originalBufferedImage.getRaster().getDataBuffer()).getData();
		byte[] outPixels = ((DataBufferByte) imgBufferGray.getRaster().getDataBuffer()).getData();
		//System.out.println(imgIn.getType());
		//System.out.println(BufferedImage.TYPE_3BYTE_BGR);//JPGs!
		//System.out.println(BufferedImage.TYPE_4BYTE_ABGR);//PNGs!
		//System.out.println(BufferedImage.TYPE_BYTE_INDEXED);//GIFs!
		/*
		for (int i = 0; i < inPixels.length; i += 4){
			//Get 0.299 of red, 0.587 of green, and 0.114 of blue 
			//Convert unsigned byte to signed int by "& 0xFF"
			outPixels[i/4] = (byte)((299 * (inPixels[i+3] & 0xff) + 587 * (inPixels[i+2] & 0xff) + 114 * (inPixels[i+1] & 0xff))/1000);
		}*/
		
		int i;
		int outIndex = 0;
		for(int y = winPos.y; y < winPos.y + imgBufferGray.getHeight(); y++){
			for (int x = winPos.x; x < winPos.x + imgBufferGray.getWidth(); x++){
				i = xyToPos(x, y, originalBufferedImage.getWidth())*4;
				//Get 0.299 of red, 0.587 of green, and 0.114 of blue 
				//Convert unsigned byte to signed int by "& 0xFF"
				outPixels[outIndex++] = (byte)((299 * (inPixels[i+3] & 0xff) + 587 * (inPixels[i+2] & 0xff) + 114 * (inPixels[i+1] & 0xff))/1000);
			}
		}
	}
	
	private EdgeData sobel(){
		int h = imgBufferGray.getHeight();
		int w = imgBufferGray.getWidth();
		
		int pos, sX, sY;
		
		byte[] gsPixels = ((DataBufferByte) imgBufferGray.getRaster().getDataBuffer()).getData();
		
		for (int y = 1; y < h - 1; y++){
			for (int x = 1; x < w - 1; x++){
				pos = xyToPos(x - 1, y - 1, w - 2);
				
				sX = 0;
				sX += -1*(gsPixels[xyToPos(x - 1, y - 1, w)] & 0xff);
				sX += -2*(gsPixels[xyToPos(x - 1, y, w)] & 0xff);
				sX += -1*(gsPixels[xyToPos(x - 1, y + 1, w)] & 0xff);
				sX += 1*(gsPixels[xyToPos(x + 1, y - 1, w)] & 0xff);
				sX += 2*(gsPixels[xyToPos(x + 1, y, w)] & 0xff);
				sX += 1*(gsPixels[xyToPos(x + 1, y + 1, w)] & 0xff);
				edgeDataBuffer.dataX[pos] = (short) Math.floor(sX);
				
				sY = 0;
				sY += -1*(gsPixels[xyToPos(x - 1, y - 1, w)] & 0xff);
				sY += -2*(gsPixels[xyToPos(x, y - 1, w)] & 0xff);
				sY += -1*(gsPixels[xyToPos(x + 1, y - 1, w)] & 0xff);
				sY += 1*(gsPixels[xyToPos(x - 1, y + 1, w)] & 0xff);
				sY += 2*(gsPixels[xyToPos(x, y + 1, w)] & 0xff);
				sY += 1*(gsPixels[xyToPos(x + 1, y + 1, w)] & 0xff);
				edgeDataBuffer.dataY[pos] = (short) Math.floor(sY);
			}
		}
		return edgeDataBuffer;
	}
	
	public static int xyToPos(int x, int y, int width){
		return y*width+x;		
	}
}

