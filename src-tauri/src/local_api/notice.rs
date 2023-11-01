pub enum ShortNoteType {
    ShortNoteTask = 0,
    ShortNoteBug = 1,
}

pub enum ShortNoteMode {
    Detail = 0,
    Show = 1,
}

#[derive(serde::Serialize, serde::Deserialize, Clone, PartialEq, Debug)]
#[serde(rename_all = "camelCase")]
pub struct ShortNotetNotice {
    pub project_id: String,
    pub short_note_mode_type: u32,
    pub short_note_type: u32,
    pub target_id: String,
    pub extra_target_value: String,
}
