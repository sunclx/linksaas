import * as dataAnnoPrjApi from "@/api/data_anno_project";

export function getDefaultConfig(annoType: dataAnnoPrjApi.ANNO_TYPE): string {
    if (annoType == dataAnnoPrjApi.ANNO_TYPE_AUDIO_CLASSIFI) {
        return `<View>
  <Header value="Listen to the audio"/>
  <Audio name="audio" value="$audio"/>
  <Header value="Select its topic"/>
  <Choices name="topic" toName="audio"
           choice="single-radio" showInline="true">
    <Choice value="Politics"/>
    <Choice value="Business"/>
    <Choice value="Education"/>
    <Choice value="Other"/>
  </Choices>
</View>`;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_AUDIO_SEG) {
        return `<View>
  <Labels name="label" toName="audio" choice="multiple">
    <Label value="Speaker 1" />
    <Label value="Speaker 2" />
  </Labels>
  <Audio name="audio" value="$audio"/>
</View>`;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_AUDIO_TRANS) {
        return `<View>
  <Header value="Listen to the audio" />
  <Audio name="audio" value="$audio" />
  <Header value="Write the transcription" />
  <TextArea name="transcription" toName="audio"
            rows="4" editable="true" maxSubmissions="1" />
</View>`;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_AUDIO_SEG_TRANS) {
        return `<View>
  <Labels name="labels" toName="audio">
    <Label value="Speaker 1" />
    <Label value="Speaker 2" />
  </Labels>
  <Audio name="audio" value="$audio"/>

  <View visibleWhen="region-selected">
    <Header value="Provide Transcription" />
  </View>

  <TextArea name="transcription" toName="audio"
            rows="2" editable="true"
            perRegion="true" required="true" />
</View>`;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_CLASSIFI) {
        return `<View>
  <Image name="image" value="$image"/>
  <Choices name="choice" toName="image" showInLine="true">
    <Choice value="Boeing" background="blue"/>
    <Choice value="Airbus" background="green" />
  </Choices>
</View>`;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_BBOX_OBJ_DETECT) {
        return `<View>
  <Image name="image" value="$image"/>
  <RectangleLabels name="label" toName="image">
    <Label value="Airplane" background="green"/>
    <Label value="Car" background="blue"/>
  </RectangleLabels>
</View>`;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_BRUSH_SEG) {
        return `<View>
  <Image name="image" value="$image"/>
  <BrushLabels name="tag" toName="image">
    <Label value="Planet" background="rgba(0, 0, 255, 0.7)"/>
    <Label value="Moonwalker" background="rgba(255, 0, 0, 0.7)"/>
  </BrushLabels>
</View>`;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_CIRCULAR_OBJ_DETECT) {
        return `<View>
  <Image name="image" value="$image"/>
  <EllipseLabels name="tag" toName="image">
    <Label value="Airplane" background="green"/>
    <Label value="Car" background="blue"/>
  </EllipseLabels>
</View>`;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_KEYPOINT) {
        return `<View>
  <Image name="image" value="$image" zoom="true" zoomControl="true"/>
  <KeyPointLabels name="label" toName="image"
                  strokewidth="2" opacity="1" >
      <Label value="Engine" background="red"/>
      <Label value="Tail" background="blue"/>
  </KeyPointLabels>
</View>`;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_IMAGE_POLYGON_SEG) {
        return `<View>
  <Header value="Select label and start to click on image"/>
  <Image name="image" value="$image"/>
  <PolygonLabels name="label" toName="image"
                 strokeWidth="3" pointSize="small"
                 opacity="0.9">
    <Label value="Airplane" background="red"/>
    <Label value="Car" background="blue"/>
  </PolygonLabels>
</View>
      `;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_CLASSIFI) {
        return `<View>
  <Text name="text" value="$text"/>
  <Choices name="sentiment" toName="text" choice="single">
    <Choice value="Positive"/>
    <Choice value="Negative"/>
    <Choice value="Neutral"/>
  </Choices>
</View>`;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_NER) {
        return `<View>
  <Labels name="label" toName="text">
    <Label value="Person" background="red"/>
    <Label value="Organization" background="darkorange"/>
    <Label value="Fact" background="orange"/>
    <Label value="Money" background="green"/>
    <Label value="Date" background="darkblue"/>
    <Label value="Time" background="blue"/>
    <Label value="Ordinal" background="purple"/>
    <Label value="Percent" background="#842"/>
    <Label value="Product" background="#428"/>
    <Label value="Language" background="#482"/>
    <Label value="Location" background="rgba(0,0,0,0.8)"/>
  </Labels>
  <Text name="text" value="$text"/>
</View>`;
    } else if (annoType == dataAnnoPrjApi.ANNO_TYPE_TEXT_SUMMARY) {
        return `<View>
  <Header value="Please read the text" />
  <Text name="text" value="$text" />

  <Header value="Provide one sentence summary" />
  <TextArea name="answer" toName="text"
            showSubmitButton="true" maxSubmissions="1" editable="true"
            required="true" />
</View>`;
    }
    return "";
}