---
title: Golang序列化库比较
publishDate: 2023-07-17 14:02:00
img: /profile/assets/technique/Golang序列化库比较/封面.jpg
description: |
  文章中的图片可以在新窗口中打开，查看清晰版。
tags:
  - Golang
  - JSON
  - Sonic
---

#### 背景介绍

在日常工作中，我们需要定义一种能够跨服务通信，跨语言传输的，统一格式的文件格式。用的最广泛的通信机制主要是HTTP+JSON和gRPC+protobuf这2种。
JSON格式的数据清晰易读，用户可以直观的理解。protobuf格式的数据体积小，传播速度快。

制约JSON性能的关键在于序列化和反序列化这两个地方。Golang原生自带encoding/json库使用频率很高，它的性能中等偏上，且在持续改进中。
字节跳动退出的sonic库，使用方式兼容encoding/json，号称是极快的JSON序列化和反序列化库，由JIT（即时编译）和SIMD（单指令多数据）加速。

在高频处理数据格式的服务中，需要多次加工数据，对序列化和反序列化调用的次数较多。这种场景下应该考虑提高序列化速率。我将编写测试文件来说明。

#### benchmark

```
package main

import (
	"bytes"
	"encoding/json"
	"github.com/bytedance/sonic"
	"os"
	"testing"
)

type Book struct {
	Name   string `json:"Title"`
	Price  float64
	Tags   []string
	Press  string
	Author People
}

type People struct {
	Name    string
	Age     int
	School  string
	Company string
	Title   string
}

var (
	people = People{
		Name:    "张三",
		Age:     18,
		School:  "中国政法大学",
		Company: "*大法考",
		Title:   "*业律师",
	}
	book = Book{
		Name:   "一千零一夜",
		Price:  998,
		Tags:   []string{"神话", "虚拟", "畅销"},
		Press:  "同济大学出版社",
		Author: people,
	}
)

func BenchmarkJsonMarshal(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_, _ = json.Marshal(book)
	}
	//BenchmarkJsonMarshal-6             736696            1389 ns/op
}

func BenchmarkJsonUnmarshal(b *testing.B) {
	var testBook Book
	var bookBytes []byte
	bookBytes, _ = json.Marshal(book)
	for i := 0; i < b.N; i++ {
		_ = json.Unmarshal(bookBytes, &testBook)
	}
	//BenchmarkJsonUnmarshal-6             295243            4905 ns/op
}

func BenchmarkJsonMarshalAndUnmarshal(b *testing.B) {
	var testBook Book
	var bookBytes []byte
	for i := 0; i < b.N; i++ {
		bookBytes, _ = json.Marshal(book)
		_ = json.Unmarshal(bookBytes, &testBook)
	}
	//BenchmarkJsonMarshalAndUnmarshal-6             177300            6000 ns/op
}

func BenchmarkJsonWriteFile(b *testing.B) {
	var bookBytes []byte
	for i := 0; i < b.N; i++ {
		bookBytes, _ = json.Marshal(book)
		output, _ := os.OpenFile("BenchmarkJsonWriteFile.json", os.O_CREATE|os.O_RDWR, 0666)
		_, _ = output.Write(bookBytes)
	}
	//BenchmarkJsonWriteFile-6             2426            499597 ns/op
}

func BenchmarkJsonEncoderWriteFile(b *testing.B) {
	file := bytes.NewBuffer([]byte{})
	encoder := json.NewEncoder(file)
	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "\t")
	for i := 0; i < b.N; i++ {
		file.Reset()
		_ = encoder.Encode(book)
		output, _ := os.OpenFile("./BenchmarkJsonEncoderWriteFile.json", os.O_CREATE|os.O_RDWR, 0666)
		_, _ = output.Write(file.Bytes())
	}
	//BenchmarkJsonEncoderWriteFile-6             2456            475556 ns/op
}

func BenchmarkSonicMarshal(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_, _ = sonic.Marshal(book)
	}
	//BenchmarkSonicMarshal-6             1390419            960 ns/op
}

func BenchmarkSonicUnmarshal(b *testing.B) {
	var testBook Book
	var bookBytes []byte
	bookBytes, _ = sonic.Marshal(book)
	for i := 0; i < b.N; i++ {
		_ = sonic.Unmarshal(bookBytes, &testBook)
	}
	//BenchmarkSonicUnmarshal-6             1000000            1204 ns/op
}

func BenchmarkSonicMarshalAndUnmarshal(b *testing.B) {
	var testBook Book
	var bookBytes []byte
	for i := 0; i < b.N; i++ {
		bookBytes, _ = sonic.Marshal(book)
		_ = sonic.Unmarshal(bookBytes, &testBook)
	}
	//BenchmarkSonicMarshalAndUnmarshal-6             646513            2215 ns/op
}

func BenchmarkSonicWriteFile(b *testing.B) {
	var bookBytes []byte
	for i := 0; i < b.N; i++ {
		bookBytes, _ = sonic.Marshal(book)
		output, _ := os.OpenFile("BenchmarkSonicWriteFile.json", os.O_CREATE|os.O_RDWR, 0666)
		_, _ = output.Write(bookBytes)
	}
	//BenchmarkSonicWriteFile-6             2400            473564 ns/op
}

func BenchmarkSonicEncoderWriteFile(b *testing.B) {
	file := bytes.NewBuffer([]byte{})
	encoder := sonic.ConfigDefault.NewEncoder(file)
	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "\t")
	for i := 0; i < b.N; i++ {
		file.Reset()
		_ = encoder.Encode(book)
		output, _ := os.OpenFile("./BenchmarkSonicEncoderWriteFile.json", os.O_CREATE|os.O_RDWR, 0666)
		_, _ = output.Write(file.Bytes())
	}
	//BenchmarkSonicEncoderWriteFile-6             2044            557176 ns/op
}
```

#### 运行示例代码

通过运行代码，我们可以看出。json marshal耗时1389ns/op，sonic marshal耗时960ns/op。json unmarshal耗时4905ns/op，sonic unmarshal耗时1024ns/op。
在序列化和反序列化方面，sonic比json速率提升明显，综合可达3倍。

分析一下原理，为什么它快，快在哪了？
https://github.com/bytedance/sonic/blob/main/docs/INTRODUCTION_ZH_CN.md

但是也不要高兴太早，当序列化之后写入文件，发现速度并无提高，甚至略有下降。
BenchmarkJsonEncoderWriteFile-6：475556 ns/op；BenchmarkSonicEncoderWriteFile-6：557176 ns/op
原因有待分析。

玩梗：

我原想整个项目一镜到底，是不是很大胆？
整个项目！一镜到底！
在数据处理这个服务，就这个服务。
就完全是这个服务，一镜到底。
我最早想性能优化的时候，
跟所有分支说的都是一镜到底。
喔所有分支，你问feature-1，story-2，
他们所有人很兴奋，epic他们很兴奋！
一镜到底，一直说的是一镜到底，
我一直在做一镜到底的准备。
我说只要我两分钟，
咱就改一行代码。
把import "encoding/json"改成import json "github.com/bytedance/sonic"。
哇所有的gomod说真的太厉害！
就挑战性太大了！
一点都不费劲儿啊，性能它就上去了。

（擦把嘴）但是后来我还是放弃了（呵呵）
你知道为什么？
我研究了大量的benchmark的代码，
我我，我后来还是放弃了。
放弃了，嗯...
