#include <iostream>
#include <jni.h>
#include "nativempc.h"

using namespace std;

extern "C" JNIEXPORT jlong JNICALL
Java_com_reactnativeblockchaincryptompc_cryptompc_CPPBridge_multiply(JNIEnv *env, jclass type, jlong a, jlong b)
{
    return nativeMpc::multiply(a, b);
}
