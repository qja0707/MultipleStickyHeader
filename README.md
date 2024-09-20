# 스티키 헤더 여러개 만들기

ScrollView 에서 제공하는 stickyHeader 를 사용하려면 단순히 [stickyHeaderIndices](https://reactnative.dev/docs/scrollview#stickyheaderindices) 에 스티키 헤더가 될 인덱스를 넣으면 된다. 하지만 인덱스 여러개를 넣게되면 인덱스에 포함되는 행들이 차례로 쌓이는게 아니라 두번 째 행이 위에 붙게되면 원래 붙어있었던 첫번 째 행은 위로 올라가 사라지고 만다. 나는 여러개의 행이 차례로 쌓이는 이른바 multiple sticky header 를 만드는 방법에 대해 내가 고민했던 방법을 정리하고자 한다.

There is [stickyHeaderIndices](https://reactnative.dev/docs/scrollview#stickyheaderindices) option in ScrollView if you need simple sticky header. However I need multiple sticky header which is stacked each sticky headers when user scroll up and the header is gone.

기본적인 원리는 스크롤 뷰 위에 스티키 헤더를 absolute 로 겹쳐놓고 스크롤의 y 좌표가 해당 헤더 위치를 지나가면 겹쳐놓은 스티키 헤더의 display 를 none 에서 flex 로 변경해주는 것이다.

Basic idea is overlapping invisible header over scrollView and when the header moving up touching top of the view, make the invisible header visible.

```js
<SafeAreaView>
  <View>
    <ScrollView onScroll={handleScroll}>// 1
      <Contents>
        <Text>zero contents</Text>
      </Contents>
      <Header onLayout={handleLayout(setFirstHeaderLayout)}>// 2        
        <Text>first header</Text>
      </Header>
      <Contents>
        <Text>first contents</Text>
      </Contents>
      ...
    </ScrollView>

    <View style={styles.stickyHeader}>  // 3
      <Header style={firstHeaderAnimatedStyle}> // 4
        <Text>first header</Text>
      </Header>
      ...
    </View>
  </View>
</SafeAreaView>;

const styles = StyleSheet.create({
  header: {
    height: 100,
    backgroundColor: "#D3D3D3",
  },
  item: {
    width: "100%",
    backgroundColor: "#AEC6CF",
    height: 500,
  },
  stickyHeader: {
    position: "absolute",
    width: "100%",
  },
});
```

기본적인 스타일은 위와 같다.

Basic style is like above.

위에 주석으로 써놓은 1번부터 설명을 하자면

I will explain from the first of annotation

1. 스크롤 뷰가 움직일 때 해당 y 값을 useSharedValue 로 관리한다.

Manage Y coordinate location using usSharedValue when scrolled

```js
const scrollY = useSharedValue(0);

const handleScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
  scrollY.value = e.nativeEvent.contentOffset.y;
};
```

2. 헤더의 위치를 알아야 1번의 scrollY 와 비교할 수 있으므로 아래와 같이 handleLayout 을 Header의 onLayout 에 넣어 렌더가 되었을 때 헤더의 수치를 저장한다.

To compare between scrolled y coordination with header's y coordination, store header's layout when the header rendered

```js
const [firstHeaderLayout, setFirstHeaderLayout] =
    useState<LayoutRectangle>(defaultLayout); // defaultLayout 은 옵셔널에 의한 코드 가독성 저하를 방지하기 위해 적당히 넣어주었다.

const handleLayout =
  (setter: Dispatch<React.SetStateAction<LayoutRectangle>>) =>
  (e: LayoutChangeEvent) => {
    setter(e.nativeEvent.layout);
  };
```

3. position: 'absolute' 로 스크롤뷰와 스티키 헤더를 겹쳐놓은 상황

Style includes position: 'absolute' to overlap on the scrollView

4. 여기서 animatedStyle 로 스크롤 뷰의 y 값이 headerLayout 의 y 값을 넘어갔을 때 보여지도록 한다.

When scrollView is scrolled, which is header is moved up and touch the top of screen, make the header visible.

```js
const firstHeaderAnimatedStyle = useAnimatedStyle(
  () => ({
    display: scrollY.value > firstHeaderLayout.y ? "flex" : "none",
  }),
  [firstHeaderLayout],
);
```

두번째 헤더 역시 같은 원리를 적용하면 위에서부터 차곡차곡 쌓이는 멀티플 스티키 헤더가 된다.

If you use above idea for second header, you can see multiple header is stacked.
