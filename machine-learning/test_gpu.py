import torch
import sys

def test_gpu_setup():
    print("🔍 Testing GPU Setup")
    print("=" * 40)
    
    # Check PyTorch version
    print(f"PyTorch version: {torch.__version__}")
    
    # Check CUDA availability
    print(f"CUDA available: {torch.cuda.is_available()}")

    # NOTE: If CUDA not available do the following:
    # Download CUDA Toolkit from https://developer.nvidia.com/cuda-downloads?target_os=Windows&target_arch=x86_64&target_version=11&target_type=exe_local
    # Download cuDNN from https://developer.nvidia.com/cudnn-downloads?target_os=Windows&target_arch=x86_64&target_version=11&target_type=exe_local
    # Restart the system after installation
    # pip uninstall torch torchvision torchaudio
    # pip3 install torch torchvision --index-url https://download.pytorch.org/whl/cu130
    
    if torch.cuda.is_available():
        print(f"CUDA version: {torch.version.cuda}")
        print(f"cuDNN version: {torch.backends.cudnn.version()}")
        print(f"Number of GPUs: {torch.cuda.device_count()}")
        
        # GPU details
        for i in range(torch.cuda.device_count()):
            print(f"\nGPU {i}:")
            print(f"  Name: {torch.cuda.get_device_name(i)}")
            print(f"  Memory: {torch.cuda.get_device_properties(i).total_memory / 1e9:.1f} GB")
            print(f"  Compute Capability: {torch.cuda.get_device_properties(i).major}.{torch.cuda.get_device_properties(i).minor}")
        
        # Test tensor operations
        print(f"\nTesting GPU Operations:")
        device = torch.device('cuda')
        
        # Create tensors on GPU
        a = torch.randn(1000, 1000, device=device)
        b = torch.randn(1000, 1000, device=device)
        
        # Matrix multiplication
        import time
        start_time = time.time()
        c = torch.matmul(a, b)
        torch.cuda.synchronize()  # Wait for GPU to finish
        gpu_time = time.time() - start_time
        
        print(f"  GPU matrix multiplication (1000x1000): {gpu_time:.4f} seconds")
        
        # Test CPU for comparison
        a_cpu = a.cpu()
        b_cpu = b.cpu()
        start_time = time.time()
        c_cpu = torch.matmul(a_cpu, b_cpu)
        cpu_time = time.time() - start_time
        
        print(f"  CPU matrix multiplication (1000x1000): {cpu_time:.4f} seconds")
        print(f"  GPU Speedup: {cpu_time/gpu_time:.2f}x")
        
    else:
        print("CUDA not available. Check your installation.")
        return False
    
    print("\nGPU setup is working correctly!")
    return True

if __name__ == "__main__":
    test_gpu_setup()